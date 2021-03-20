import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { API, Storage } from 'aws-amplify';
import { createItem as createItemMutation } from './graphql/mutations';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const initialFormState = { name: '', description: '' }

class DetailPage extends Component{

  constructor(props) {
    super(props);
    //this.handleChange1 = this.handleChange1.bind(this)
    //this.handleChange2 = this.handleChange2.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.createItem = this.createItem.bind(this);
    //this.editItem = this.editItem.bind(this);
    //this.onChange = this.onChange.bind(this);
    
    this.state = {
      id: "",
      item: this.props.location.state.item      
    };

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

  //handleChange1(e){
  //  this.setState({
  //    text1: e.target.value
  //  })
  //}

  //handleChange2(e){
  //  this.setState({
  //    text2: e.target.value
  //  })
  //}

  handleClick() {
    this.props.history.push({
      pathname: '/',
      state: { 
        name: this.state.name,
        description: this.state.description
      }
    });
  }

  render(){
    return(
      // <div>
      <div class="container-fluid">
      <div class="row">
        <div class="col-8">
        <input type='text' value={this.state.item.name} onChange={ (e) => this.handleChange1(e) }></input>
        </div>
        <div class="col-8">
        <input type='text' value={this.state.item.description} onChange={ (e) => this.handleChange2(e) }></input>
        </div>
        {/* <button onClick={this.handleClick}>OK</button> */}
        <Button onClick={this.handleClick}>OK</Button>
      </div>
      </div>
    )
  }
}

export default withRouter(DetailPage);
