import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { API, Storage } from 'aws-amplify';
import { createItem as createItemMutation } from './graphql/mutations';
import { updateItem as updateItemMutation } from './graphql/mutations';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

class DetailPage extends Component{

  constructor(props) {
    super(props);
    this.handleChange1 = this.handleChange1.bind(this)
    this.handleChange2 = this.handleChange2.bind(this)
    this.onChangeImage = this.onChangeImage.bind(this);
    this.handleClick = this.handleClick.bind(this)
    this.createItem = this.createItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    
    this.state = {
      item: this.props.location.state.item,
    };

  }

  async createItem() {
    if (!this.state.item.name || !this.state.item.description) return;
    const newItem = {
      name: this.state.item.name,
      description: this.state.item.description,
      imageFile: this.state.item.imageFile,
      imageUrl: this.state.item.imageUrl
    };
    await API.graphql({ query: createItemMutation, variables: { input: newItem } });
  }

  async updateItem() {
    if (!this.state.item.name || !this.state.item.description) return;
    const newItem = {
      id: this.state.item.id,
      name: this.state.item.name,
      description: this.state.item.description,
      imageFile: this.state.item.imageFile,
      imageUrl: this.state.item.imageUrl
    };
    await API.graphql({ query: updateItemMutation, variables: { input: newItem } });
  }

  handleChange1(e){
    this.setState({item: { ...this.state.item, name: e.target.value }});
  }

  handleChange2(e){
   this.setState({item: { ...this.state.item, description: e.target.value }});
  }

  handleClick() {
    // item.idがnullの時は新規作成、listpageから渡されてきたときは更新
    if (this.state.item.id === "") {
      this.createItem();
    }
    else {
      this.updateItem();
    }
    this.returnToListPage();
  }

            



  async onChangeImage(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    this.setState({item: { ...this.state.item, imageFile: file.name }});
    // imageFileをStorage(s3 service)に保存する
    await Storage.put(file.name, file);
    if (this.state.item.imageFile) {
      // imageFile名からimageUrlを取得する
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
      <div className="container-fluid">
      <form>
        <div className="form-group">
            <label for="itemname">タイトル</label>
            <input
            type='text' className="form-control" id="itemname" 
            onChange={this.handleChange1}
            placeholder="item name"
            value={this.state.item.name}
          />
        </div>
        <div className="form-group">
          <label for="itemdesc">説明</label>
          <input
            type='text' className="form-control" id="itemdesc" 
            onChange={e => this.setState({item: { ...this.state.item, 'description': e.target.value }})}
            placeholder="description"
            value={this.state.item.description}
          />
        </div>
        <div className="form-group">
          <label for="itemimage">イメージ</label>
          <p>id:{this.state.item.id}</p>
          <p>imageFile:{this.state.item.imageFile}</p>
          <p>imageUrl:{this.state.item.imageUrl}</p>
          <img src={this.state.item.imageUrl} style={{width: 50,height:50}} alt=""/>
          <input
             type="file" className="form-control" id="itemimage"
             onChange={this.onChangeImage}
          />
        </div>
        <div className="form-group">
          <Button onClick={this.handleClick}>OK</Button>
        </div>
      </form>
    </div>
    )
  }
}

export default withRouter(DetailPage);
