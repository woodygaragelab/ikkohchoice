import React from 'react';
import { Component } from 'react';
import './App.css';
import './listpage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';

import awsConfiguration    from './awsConfiguration'
import {
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js"

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId:   awsConfiguration.ClientId,
})

class SignUpPage extends Component {

  constructor(props){
    super(props);
    this.handleChange1     = this.handleChange1.bind(this);
    this.handleChange2     = this.handleChange2.bind(this);
    this.signup           = this.signup.bind(this);

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

  signup() {
    console.log('signup')
    const attributeList = [
      new CognitoUserAttribute({
        Name: "email",
        Value: this.state.email,
      }),
    ];
    userPool.signUp(
      this.state.email,
      this.state.password,
      attributeList,
      [],
      (err) => {
        if (err) {
          console.log(err);
          this.setState({ error: true });
          return;
        }
        this.setState({
          email: "",
          password: "",
          success: true,
        });
      }
    );

  }

  render() {

    return (
      <div className="container-fluid AppBody">

        <div className="fixed-top">

          <div className="row AppHeader">
            <div className="col-6"><h4>Ikkoh ユーザー登録</h4></div>
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
          <button onClick={this.signup}>登録</button>
        </div>

      </div>
    );
  }
}

export default withRouter(SignUpPage)  