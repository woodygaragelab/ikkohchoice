import React from 'react';
import { Component } from 'react';
import './App.css';
import './listpage.css';

import Header from './header'  
import TabGroup from './tabgroup'   
import Footer from './footer'       

import { Storage } from 'aws-amplify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit,faTrash,faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { faAmazon } from "@fortawesome/free-brands-svg-icons";

import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration    from './awsConfiguration'
const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId:   awsConfiguration.ClientId,
})

const initialItemState = [{ name: '...', description: 'loading...' }]

class ListPage extends Component {

  constructor(props){
    super(props);
    this.fetchItemsFromAPI = this.fetchItemsFromAPI.bind(this);
    this.createItem        = this.createItem.bind(this);
    this.editItem          = this.editItem.bind(this);
    this.login             = this.login.bind(this);
    this.signin            = this.signin.bind(this);
    this.signout           = this.signout.bind(this);

    const username         = this.get_user();
    const category         = this.props.category;

    this.state = {
      devmode:  false,
      username: username, 
      items:    initialItemState,
      category: category
    };
    this.fetchItemsFromAPI(this.state.category);
  }

  get_user() {
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      console.log(cognitoUser);
      return cognitoUser.username;
    } else {
      return '';
    }
  }

  async fetchItemsFromAPI(cat) {
    this.setState({items:initialItemState}); 
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"function":"list","category":cat});
    var requestOptions = {method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };
    fetch("https://yxckp7iyk4.execute-api.ap-northeast-1.amazonaws.com/dev", requestOptions)
    .then(response => response.text())
    .then(async(response) => {
      const apiData = JSON.parse(response);
      apiData.map(async item => {
        if (item.imagefile) {
          // imageFile名からimageUrlを取得する
          let dataExpireSeconds = (3 * 60);
          const imageurl = await Storage.get(item.imagefile, { expires: dataExpireSeconds });
          item.imageurl = imageurl;
          this.setState({items: apiData});   //imageurlを取得ごとに非同期でセットする。apiDataのmap中の処理でもOK？
          return item;    
        }
        return item;    
      })
    })
    .catch(error => console.log('error', error));
    //alert(response);
  }

  async createItem() {
    this.props.history.push({
      pathname: '/detailpage',
      state: {  item: {ID:""}  }
    });
  }

  async deleteItemFromAPI({ ID }) {
    const newItemsArray = this.state.items.filter(item => item.ID !== ID);
    this.setState({items: newItemsArray});
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"function":"delete", "ID":ID });
    var requestOptions = {method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };
    fetch("https://yxckp7iyk4.execute-api.ap-northeast-1.amazonaws.com/dev", requestOptions)
    .catch(error => console.log('error', error));
  }

  editItem(item) {
    this.props.history.push({
      pathname: '/detailpage',
      state: { item: item }
    });
  }

  //隠しボタンで起動するdevmode
  login() {
    this.setState({devmode: !this.state.devmode});
  }

  signin() {
    this.props.history.push({ pathname: '/signin' });  
  }

  signout(){
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      cognitoUser.signOut()
      localStorage.clear()
      console.log('signed out')
      this.props.history.push({ pathname: '/listpageillust' });  
    } else {
      localStorage.clear()
      console.log('no user signing in')
    }
  }

  render() {

    return (
      <div className="container-fluid AppBody">

        <div className="fixed-top">
          <Header   state={this.state} ></Header>
          <TabGroup category={this.state.category} devmode={this.state.devmode}></TabGroup>
        </div>
        <div className="AppFiller">x</div>

        <div className="mt-5 container-fluid AppBody">
        {
          this.state.items.map(item => (
            <div className="card" key={item.id || item.name}>
              <div className="card-body AppCard2">
                <div className="row">
                  <div className="col-2">
                    <img src={item.imageurl} className="AppImage" alt=""/> 
                  </div>
                  <div className="col-8">
                    <div><h4>{item.name}</h4></div>
                    <div>{item.description}</div>
                  </div>
                  <div className="col-1">
                    <a className="btn btn-primary" href={item.amazonurl} role="button">
                        <FontAwesomeIcon icon={faAmazon} />
                    </a>
                  </div>
                  {this.state.devmode &&
                    <div className="col-1">
                      <button type="button" onClick={() => this.editItem(item)} className="m-1 btn btn-primary">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button type="button" onClick={() =>  this.deleteItemFromAPI(item)} className="m-1 btn btn-primary">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  } 
                </div>              
              </div>              
            </div>              
          ))
        }
        </div>

        <div style={{marginTop: 100}}  className="container-fluid">
        <div className="row">
          <div className="col-10"/>
          <div className="col-2">
            {this.state.devmode &&
              <button type="button" onClick={this.createItem} className="btn btn-primary">
                <FontAwesomeIcon icon={faPlusCircle} />
              </button>
            }
          </div>
        </div>              
        </div> 

      <Footer handleLogin={this.login}></Footer>
      </div>
    );
  }
}

export default withRouter(ListPage)  
      