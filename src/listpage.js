import React from 'react';
//import { useState, useEffect } from 'react';
import { Component } from 'react';
import './listpage.css';
import { API, Storage } from 'aws-amplify';
//import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listItems } from './graphql/queries';
//import { createItem as createItemMutation } from './graphql/mutations';
import { deleteItem as deleteItemMutation } from './graphql/mutations';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router-dom';

const initialFormState = { name: '', description: '', image: '', imageFile: '', imageUrl: '' }
const initialItemState = [{ name: '', description: '' }]

class ListPage extends Component {

  constructor(props){
    super(props);
    this.fetchItems = this.fetchItems.bind(this);
    this.createItem = this.createItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.onChange = this.onChange.bind(this);
    
    this.fetchItems();
    this.state = {
      user: "aa",
      items: initialItemState,
      formData: initialFormState
    };

  }

  async fetchItems() {
    const apiData = await API.graphql({ query: listItems });
    const itemsFromAPI = apiData.data.listItems.items;
    await Promise.all(itemsFromAPI.map(async item => {
      if (item.imageFile) {
        const imageUrl = await Storage.get(item.imageFile);
        item.imageUrl = imageUrl;
      }
      return item;
    }))
    this.setState({items: apiData.data.listItems.items});
  }

  async createItem() {
    // if (!this.state.formData.name || !this.state.formData.description) return;
    // await API.graphql({ query: createItemMutation, variables: { input: this.state.formData } });
    // //const res = await API.graphql({ query: createItemMutation, variables: { input: this.state.formData } });

    this.props.history.push({
      pathname: '/detailpage',
      state: { 
        item: {id:""}
      }
    });

  }

  async deleteItem({ id }) {
    const newItemsArray = this.state.items.filter(item => item.id !== id);
    this.setState({items: newItemsArray});
    await API.graphql({ query: deleteItemMutation, variables: { input: { id } }});
  }

  editItem(item) {
    this.props.history.push({
      pathname: '/detailpage',
      state: { 
        item: item
      }
    });
  }

  async onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    this.setState({formData: { ...this.state.formData, image: file.name }});
    await Storage.put(file.name, file);
    this.fetchItems();
  }

  handleChange(e){
    this.setState({
      text: e.target.value
    })
  }

  render() {
    return (
      <div style={{marginBottom: 30}}  className="container-fluid">
        <h1>I's choice {this.state.user}</h1>
        {
          this.state.items.map(item => (
            <Card>
            <Card.Body>
              <div key={item.id || item.name}>
              {/* <div className="container-fluid"> */}
              <div className="row">
                <div className="col-4">
                  <img src={item.imageUrl} style={{width: 50,height:50}} alt=""/>
                </div>
                <div className="col-6">
                  <div>{item.name}</div>
                  <div>{item.description}</div>
                </div>
                <div className="col-2">
                  <Button onClick={() =>  this.editItem(item)} variant="outline-primary">Edit</Button>
                  <Button onClick={() =>  this.deleteItem(item)} variant="outline-primary">Del</Button>
                </div>
              </div>              
              </div>              
              {/* </div>               */}
            </Card.Body>
            </Card>
          ))
        }

      <div className="container-fluid">
       <div className="row">
         <div className="col-3">
           <Button onClick={this.createItem} variant="outline-primary">ADD</Button>
         </div>
         {/* <div className="col-3">
           <input
             onChange={e => this.setState({formData: { ...this.state.formData, 'name': e.target.value }})}
             placeholder="name"
             value={this.state.formData.name}
           />
         </div>
         <div className="col-3">
           <input
             onChange={e => this.setState({formData: { ...this.state.formData, 'description': e.target.value }})}
             placeholder="description"
             value={this.state.formData.description}
           />
         </div>
         <div className="col-3">
           <input
             type="file"
             onChange={this.onChange}
           />
         </div> */}
       </div>              
      </div> 

      </div>
    );
  }
}

export default withRouter(ListPage)  
      