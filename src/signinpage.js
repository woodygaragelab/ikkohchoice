import React from 'react';
import { Component } from 'react';
import './App.css';
import './listpage.css';
//import Header from './header'   
//import Footer from './footer'        // コンポネント（部品）化したFooter
//import { Storage } from 'aws-amplify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faEdit,faTrash,faPlusCircle } from "@fortawesome/free-solid-svg-icons";
//import { faAmazon } from "@fortawesome/free-brands-svg-icons";

import awsConfiguration    from './awsConfiguration'
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from "amazon-cognito-identity-js"

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId:   awsConfiguration.ClientId,
})

class SignInPage extends Component {

  constructor(props){
    super(props);
    this.handleChange1     = this.handleChange1.bind(this);
    this.handleChange2     = this.handleChange2.bind(this);
    // this.login             = this.login.bind(this);
    this.signin            = this.signin.bind(this);
    //this.signout           = this.signout.bind(this);

    const username  = this.get_user();

    this.state = {
      devmode:  true,
      username: username, 
      email:    '',
      password: ''
    };
  }

  get_user() {
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      console.log(cognitoUser);
      return cognitoUser.username;
    } else {
      console.log('no user');
      return 'no user';
    }
  }


  handleChange1(e){
    this.setState({email: e.target.value });
  }

  handleChange2(e){
    this.setState({password: e.target.value });
  }

  //隠しボタンで起動するdevmode
  // login() {
  //   console.log('login')
  //   //this.setState({devmode: !this.state.devmode});
  // }

  signin() {
    console.log('signin')
    const authenticationDetails = new AuthenticationDetails({
      Username : this.state.email,
      Password : this.state.password
    })
    const cognitoUser = new CognitoUser({
      Username: this.state.email,
      Pool: userPool
    })
    console.log('Username:')
    console.log(this.state.email)
    console.log('cognitoUser:')
    console.log(cognitoUser)

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('result: ' + result)
        const accessToken = result.getAccessToken().getJwtToken()
        console.log('AccessToken: ' + accessToken)
        this.setState({email:''})
        this.setState({password:''})
        this.props.history.push({ pathname: '/listpageillust' });  
      },
      onFailure: (err) => {
        console.error(err)
      }
    })

  }

  render() {

    return (
      <div className="container-fluid AppBody">

        <div className="fixed-top">

          <div className="row AppHeader">
            <div className="col-6"><h4>Ikkoh Sign In</h4></div>
            {/* <div className="col-4 AppRight" onClick={this.account}>アカウント:{this.state.username}({this.state.devmode.toString()})</div> */}
          </div>
          
        </div>

        <div className="AppFiller">x</div>

        <div className="form-group">

          <span className="AppSignin">Email</span>
          <input
            type='text' id="email" 
            onChange={this.handleChange1}
            placeholder=""
            value={this.state.email}
            className="AppEmail"
          />
          <br/>
          <span className="AppSignin">Password</span>
          <input type="password" placeholder=''
            onChange={this.handleChange2}
            value={this.state.password}
            className="AppPassword"
          />
          <br/><br/>
          <button onClick={this.signin}>Sign In</button>
        </div>

      </div>
    );
  }
}

export default withRouter(SignInPage)  