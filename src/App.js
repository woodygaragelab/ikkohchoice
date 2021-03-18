import React from 'react';
//import { useState, useEffect } from 'react';
//import { Component } from 'react';
import './App.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listItems } from './graphql/queries';
import { createItem as createItemMutation, deleteItem as deleteItemMutation } from './graphql/mutations';
import 'bootstrap/dist/css/bootstrap.min.css';
//import Button from 'react-bootstrap/Button';
//import Card from 'react-bootstrap/Card';
import ListPage from './listpage';
import DetailPage from './detailpage';
import { BrowserRouter as Router } from 'react-router-dom';
import {Route, Switch} from 'react-router-dom';
//import { withRouter } from 'react-router-dom';
//import FirstPage from './FirstPage';
//import SecondPage from './SecondPage';

const initialFormState = { name: '', description: '' }
const initialItemState = [{ name: '', description: '' }]

class App extends React.Component {
//export default class Routes extends Component {

  constructor(props) {
    super(props);
    this.fetchItems = this.fetchItems.bind(this);
    this.createItem = this.createItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      items: initialItemState,
      formData: initialFormState
    };
  }

  async fetchItems() {
    const apiData = await API.graphql({ query: listItems });
    const itemsFromAPI = apiData.data.listItems.items;
    await Promise.all(itemsFromAPI.map(async item => {
      if (item.image) {
        const image = await Storage.get(item.image);
        item.image = image;
      }
      return item;
    }))
    this.setState({items: apiData.data.listItems.items});
  }

  async createItem() {
    if (!this.state.formData.name || !this.state.formData.description) return;
    await API.graphql({ query: createItemMutation, variables: { input: this.state.formData } });
    if (this.state.formData.image) {
      const image = await Storage.get(this.state.formData.image);
      this.state.formData.image = image;
      this.setState({formData: this.state.formData});
    }
    this.setState({items: [ ...this.state.items, this.state.formData ]});
    this.setState({formData: initialFormState});    
  }

  async deleteItem({ id }) {
    const newItemsArray = this.state.items.filter(item => item.id !== id);
    this.setState({items: newItemsArray});
    await API.graphql({ query: deleteItemMutation, variables: { input: { id } }});
  }

  editItem({id}) {
    this.props.history.push({
       pathname: '/detail',
       state: { 
         id: id
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

  handleClick(){
    this.props.history.push('/secondpage')
  }


  render(){
    return (
      <div className="App">

        <div>
        <Router>
        <Switch>
            <Route exact={true} path='/' component={ListPage}/>
            <Route exact={true} path='/detailpage' component={DetailPage}/>
        </Switch>
        </Router>
        </div>
      

      {/* <Router> */}
          {/* <div> */}
            {/* <Route exact path='/' component={Home}/> */}
            {/* <Route path='/detail' component={Detail}/> */}
          {/* </div> */}
      {/* </Router> */}


          
      {/* <div class="container-fluid">
       <div class="row">
         <div class="col-3">
           <Button onClick={this.createItem} variant="outline-primary">ADD</Button>
         </div>
         <div class="col-3">
           <input
             onChange={e => this.setState({formData: { ...this.state.formData, 'name': e.target.value }})}
             placeholder="name"
             value={this.state.formData.name}
           />
         </div>
         <div class="col-3">
           <input
             onChange={e => this.setState({formData: { ...this.state.formData, 'description': e.target.value }})}
             placeholder="description"
             value={this.state.formData.description}
           />
         </div>
         <div class="col-3">
           <input
             type="file"
             onChange={this.onChange}
           />
         </div>
       </div>              
      </div>  */}

      <AmplifySignOut />
    </div>
  )};
}

export default withAuthenticator(App);
//export default App;
// export default withRouter(App)