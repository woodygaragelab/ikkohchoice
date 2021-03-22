import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { API, Storage } from 'aws-amplify';
import { createItem as createItemMutation } from './graphql/mutations';
import { updateItem as updateItemMutation } from './graphql/mutations';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

const initialFormState = { name: '', description: '' }

class DetailPage extends Component{

  constructor(props) {
    super(props);
    this.handleChange1 = this.handleChange1.bind(this)
    this.handleChange2 = this.handleChange2.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.createItem = this.createItem.bind(this);
    //this.editItem = this.editItem.bind(this);
    this.onChangeImage = this.onChangeImage.bind(this);
    
    this.state = {
      //id: "",
      item: this.props.location.state.item,
      imageUrl: ""
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

  async updateItem() {
    if (!this.state.item.name || !this.state.item.description) return;
    const newItem = {
      id: this.state.item.id,
      name: this.state.item.name,
      description: this.state.item.description,
      imageFile: this.state.item.imageFile
    };
    await API.graphql({ query: updateItemMutation, variables: { input: newItem } });
    // if (this.state.item.image) {
    //   const image = await Storage.get(this.state.item.image);
    //   this.state.item.image = image;
    //   this.setState({item: this.state.item});
    // }
  }

  handleChange1(e){
   this.setState({
     name: e.target.value
    })
  }

  handleChange2(e){
   this.setState({
     description: e.target.value
   })
  }

  handleClick() {
    this.updateItem();
    this.returnToListPage();
  }

  async onChangeImage(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    this.setState({item: { ...this.state.item, imageFile: file.name }});
    await Storage.put(file.name, file);
    if (this.state.item.imageFile) {
      const imageUrl = await Storage.get(this.state.item.imageFile);
      this.setState({item: {...this.state.item, imageUrl: imageUrl}});
      this.setState({imageUrl: imageUrl});
    }

  }

  returnToListPage() {
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
      <div class="container-fluid">
      <form>
        <div class="form-group">
            <label for="itemname">タイトル</label>
            <input
            type='text' class="form-control" id="itemname" 
            onChange={e => this.setState({item: { ...this.state.item, 'name': e.target.value }})}
            placeholder="item name"
            value={this.state.item.name}
          />
        </div>
        <div class="form-group">
          <label for="itemdesc">説明</label>
          <input
            type='text' class="form-control" id="itemdesc" 
            onChange={e => this.setState({item: { ...this.state.item, 'description': e.target.value }})}
            placeholder="description"
            value={this.state.item.description}
          />
        </div>
        <div class="form-group">
          <label for="itemimage">イメージ</label>
          <p>imageFile:{this.state.item.imageFile}</p>
          <p>imageUrl:{this.state.item.imageUrl}</p>
          <img src={this.state.item.imageUrl} style={{width: 50,height:50}} alt=""/>
          <input
             type="file" class="form-control" id="itemimage"
             onChange={this.onChangeImage}
          />
        </div>
        <div class="form-group">
          <Button onClick={this.handleClick}>OK</Button>
        </div>
      </form>
    </div>
    )
  }
}

export default withRouter(DetailPage);
