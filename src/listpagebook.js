import React from 'react';
import { Component } from 'react';
import './App.css';
import './listpage.css';
import { Storage } from 'aws-amplify';
//import { API } from 'aws-amplify';
//import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
//import { Auth } from 'aws-amplify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit,faTrash,faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { faAmazon } from "@fortawesome/free-brands-svg-icons";

const initialItemState = [{ name: 'initial', description: 'item state' }]

class ListPageBook extends Component {

  constructor(props){
    super(props);
    this.fetchItemsFromAPI = this.fetchItemsFromAPI.bind(this);
    this.createItem = this.createItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.login = this.login.bind(this);
    this.selectBook = this.selectBook.bind(this);
    this.selectFood = this.selectFood.bind(this);
    this.state = {
      isLoggedIn: false,
      username: "",
      items: initialItemState,
      category: "book"
    };
    this.fetchItemsFromAPI(this.state.category);
  }

  async fetchItemsFromAPI(cat) {
      this.state = {items:initialItemState}
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"function":"list","category":cat});
    var requestOptions = {method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };
    fetch("https://yxckp7iyk4.execute-api.ap-northeast-1.amazonaws.com/dev", requestOptions)
    .then(response => response.text())
    .then(async(response) => {
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

  //隠しボタンで起動するlogin
  login() {
    this.setState({isLoggedIn: !this.state.isLoggedIn});
  }


  selectBook() {  this.props.history.push({ pathname: '/listpagebook' });  }
  selectFood() {  this.props.history.push({ pathname: '/listpagefood' });  }

  render() {

    return (
      <div className="mt-5 container-fluid bg-color-1">
        <header className="fixed-top">
          <div className="bg-color-1"><h1>Ikkohのおすすめ{this.state.username}</h1></div>
        </header>
        <div className="k2Header k2310BgH">
          <div onClick={this.selectBook} className="col-6 k2310FgH">Book</div>
          <div onClick={this.selectFood} className="col-6 k2310BgH">Food</div>
        </div>

        {
          this.state.items.map(item => (
            <div className="card" key={item.id || item.name}>
              <div className="card-body bg-color-2">
                <div className="row">
                  <div className="col-2">
                    <img src={item.imageurl} className="kzImage" alt=""/> 
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
                  {this.state.isLoggedIn &&
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

        <div style={{marginTop: 100}}  className="container-fluid">
        <div className="row">
          <div className="col-10"/>
          <div className="col-2">
            {this.state.isLoggedIn &&
              <button type="button" onClick={this.createItem} className="btn btn-primary">
                <FontAwesomeIcon icon={faPlusCircle} />
              </button>
            }
            <button type="button" onClick={this.login} className="btn btn-secondary"/>
          </div>
        </div>              
        </div> 

      </div>
    );
  }
}

export default withRouter(ListPageBook)  
      