import React from 'react';
import { Component } from 'react';
import './listpage.css';
import { Storage } from 'aws-amplify';
//import { API } from 'aws-amplify';
//import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
//import { Auth } from 'aws-amplify';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit,faTrash,faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { faAmazon } from "@fortawesome/free-brands-svg-icons";

const initialItemState = [{ name: 'initial', description: 'item state' }]

class ListPage extends Component {

  constructor(props){
    super(props);
    this.fetchItemsFromAPI = this.fetchItemsFromAPI.bind(this);
    this.createItem = this.createItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.login = this.login.bind(this);
    this.state = {
      isLoggedIn: false,
      username: "",
      items: initialItemState
    };
    this.fetchItemsFromAPI();
  }

  async fetchItemsFromAPI() {
    this.state = {items:initialItemState}
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"function":"list","category":"food"});
    var requestOptions = {method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };
    fetch("https://yxckp7iyk4.execute-api.ap-northeast-1.amazonaws.com/dev", requestOptions)
    .then(response => response.text())
    .then(async(response) => {
      //this.setState({items: []});
      const apiData = JSON.parse(response);
      //await Promise.all(apiData.map(async item => {
      apiData.map(async item => {
        if (item.imagefile) {
          // imageFile名からimageUrlを取得する
          let dataExpireSeconds = (3 * 60);
          const imageurl = await Storage.get(item.imagefile, { expires: dataExpireSeconds });
          //const bucket   = "https://ikkohchoice232927-staging.s3-ap-northeast-1.amazonaws.com/public/";
          //const imageurl = bucket + item.imagefile;
          item.imageurl = imageurl;
          this.setState({items: apiData});   //imageurlを取得ごとに非同期でセットする。apiDataのmap中の処理でもOK？
          return item;    
        }
        return item;    
      })
      //this.setState({items: apiData});      //ここでsetStateするとimageurlのセット前に実行される
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

  orderItem(item) {
    this.props.history.push({
      pathname: '/detailpage',
      state: { item: item }
    });
  }

  //隠しボタンで起動するlogin
  login() {
    this.setState({isLoggedIn: !this.state.isLoggedIn});
  }

  render() {

    return (
      <div style={{marginBottom: 30}}  className="container-fluid">
        <h1>Ikkohのおすすめ書籍{this.state.username}</h1>

        {
          this.state.items.map(item => (
            <div key={item.id || item.name}>
            <Card>
            <Card.Body>
              <div className="row">
                <div className="col-4">
                  <img src={item.imageurl} style={{width: 50,height:50}} alt=""/>
                </div>
                <div className="col-5">
                  <div>{item.name}</div>
                  <div>{item.description}</div>
                </div>
                <div className="col-1">
                  <a class="btn btn-primary" href={item.amazonurl} role="button">
                      <FontAwesomeIcon icon={faAmazon} />
                  </a>
                </div>
                {this.state.isLoggedIn &&
                  <div className="col-2">
                    <Button 
                      onClick={() =>  this.editItem(item)} variant="outline-primary">
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button onClick={() =>  this.deleteItemFromAPI(item)} variant="outline-primary">
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                } 
                </div>              
              {/* </div>               */}
            </Card.Body>
            </Card>
            </div>              
          ))
        }

      <div style={{marginTop: 100}}  className="container-fluid">
       <div className="row">
         <div className="col-10"/>
         <div className="col-2">
         {this.state.isLoggedIn &&
           <Button onClick={this.createItem} variant="outline-primary">
             <FontAwesomeIcon icon={faPlusCircle} />
           </Button>
         }
           <Button onClick={this.login} className="btn btn-light"/>            
         </div>
       </div>              
      </div> 

      </div>
    );
  }
}

export default withRouter(ListPage)  
      