import { React, Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Storage } from 'aws-amplify';
import Header from './header'  
//import TabGroup from './tabgroup'   
import Footer from './footer'       

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './listpage.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit,faTrash,faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration    from './awsConfiguration'
const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId:   awsConfiguration.ClientId,
})

const initialItemState = [{ name: 'initial', description: 'item state' }]

class ListPageIllust extends Component {

  constructor(props){
    super(props);
    this.fetchItemsFromAPI = this.fetchItemsFromAPI.bind(this);
    this.createItem        = this.createItem.bind(this);
    this.editItem          = this.editItem.bind(this);
    this.devmode           = this.devmode.bind(this);
    this.account           = this.account.bind(this);
    this.selectIllust      = this.selectIllust.bind(this);
    this.selectBook        = this.selectBook.bind(this);
    this.selectFood        = this.selectFood.bind(this);

    const username = this.get_user();
    this.state = {
      devmode:  false,
      username: username, 
      items:    initialItemState,
      category: "illust"
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
    this.setState({items: initialItemState});  // item 初期化
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

  account() {
    this.props.history.push({
      pathname: '/account',
    });
  }

  devmode()        {  this.setState({devmode: !this.state.devmode });            }

  selectIllust() {  this.props.history.push({ pathname: '/listpageillust' });  }
  selectBook()   {  this.props.history.push({ pathname: '/listpagebook' });    }
  selectFood()   {  this.props.history.push({ pathname: '/listpagefood' });    }

  render() {

    return (
      <div className="container-fluid AppBackground">

        <div className="fixed-top">
          <Header state={this.state} devmode={this.state.devmode}></Header>

          <div className="row AppTabGroup">
            <div onClick={this.selectIllust} className="col-6 AppTabSelected">イラスト</div>
            <div onClick={this.selectBook}   className="col-6 AppTabUnselected">Ikkoh's Choice</div>
          </div>
        </div>

        <div className="row AppFiller">x</div>
        <div className="row AppFiller">x</div>

        <div className="card-deck AppList">
        {
          this.state.items.map(item => (
            <div className="card m-1 AppCard" key={item.id || item.name}>
              <div className="card-body">
                    <img src={item.imageurl} className="AppImage" alt=""/> 
                    <div><h4>{item.name}</h4></div>
                    <div>{item.description}</div>
                    <a className="btn btn-primary mx-1" href={item.imageurl} download role="button">
                      <FontAwesomeIcon icon={faDownload} />
                    </a>
                  {this.state.devmode &&
                    <button type="button" onClick={() => this.editItem(item)} className="btn btn-primary mx-1">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  } 
                  {this.state.devmode &&
                    <button type="button" onClick={() => this.deleteItemFromAPI(item)} className="btn btn-primary mx-1">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  } 
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
        
        <Footer handleLogin={this.devmode}></Footer>
      </div>
    );
  }
}

export default withRouter(ListPageIllust)  