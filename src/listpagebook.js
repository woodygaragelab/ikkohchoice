import React from 'react';
import { Component } from 'react';
import './App.css';
import './listpage.css';
import Footer from './footer'        // コンポネント（部品）化したFooter
import { Storage } from 'aws-amplify';
//import { API } from 'aws-amplify';
//import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
//import { Auth } from 'aws-amplify';
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

const initialItemState = [{ name: 'initial', description: 'item state' }]

class ListPageBook extends Component {

  constructor(props){
    super(props);
    this.fetchItemsFromAPI = this.fetchItemsFromAPI.bind(this);
    this.createItem        = this.createItem.bind(this);
    this.editItem          = this.editItem.bind(this);
    this.login             = this.login.bind(this);
    this.selectIllust      = this.selectIllust.bind(this);
    this.selectBook        = this.selectBook.bind(this);
    this.selectFood        = this.selectFood.bind(this);

    const username = this.get_user();

    this.state = {
      devmode:  true,
      username: username, 
      items:    initialItemState,
      category: "book"
    };
    this.fetchItemsFromAPI(this.state.category);
  }

  get_user() {
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      console.log(cognitoUser);
      return cognitoUser.username;
    } else {
      return 'no user';
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

  selectIllust() {  this.props.history.push({ pathname: '/listpageillust' });  }
  selectBook()   {  this.props.history.push({ pathname: '/listpagebook' });  }
  selectFood()   {  this.props.history.push({ pathname: '/listpagefood' });  }

  render() {

    return (
      <div className="mt-5 container-fluid AppBody">
        <header className="fixed-top">
          <div className="row AppBody">
            <div className="col-6"><h4>Ikkoh's Choice</h4></div>
            <div className="col-6 AppRight" onClick={this.account}>アカウント:{this.state.username}({this.state.devmode.toString()})</div>
          </div>

          <div className="AppTabGroup AppBody">
            {this.state.devmode &&
            <div onClick={this.selectIllust} className="col-1 AppTabUnselected">I</div>
            }
            <div onClick={this.selectBook} className="col-6 AppTabSelected">Book</div>
            <div onClick={this.selectFood} className="col-6 AppTabUnselected">Food</div>
          </div>
        </header>

        <div className="mt-5 container-fluid AppBody">
        {
          this.state.items.map(item => (
            <div className="card" key={item.id || item.name}>
              <div className="card-body AppList">
                <div className="row">
                  <div className="col-2">
                    <img src={item.imageurl} className="AppImage" alt=""/> 
                  </div>
                  <div className="col-6">
                    <div><h4>{item.name}</h4></div>
                    <div>{item.description}</div>
                  </div>
                  <div className="col-2">
                    <a className="btn btn-primary" href={item.amazonurl} role="button">
                        <FontAwesomeIcon icon={faAmazon} />
                    </a>
                  </div>
                  {this.state.devmode &&
                    <div className="col-2">
                      <button type="button" onClick={() => this.editItem(item)} className="btn btn-primary">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button type="button" onClick={() =>  this.deleteItemFromAPI(item)} className="btn btn-primary">
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

export default withRouter(ListPageBook)  
      