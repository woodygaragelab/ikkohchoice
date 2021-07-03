import React from 'react';
import { Component } from 'react';
import './App.css';
import './listpage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';

import awsConfiguration    from './awsConfiguration'
import {
  CognitoUserPool,
  CognitoUser,
} from "amazon-cognito-identity-js"

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId:   awsConfiguration.ClientId,
})

class VerificationPage extends Component {

  constructor(props){
    super(props);
    this.handleChange1     = this.handleChange1.bind(this);
    this.handleChange2     = this.handleChange2.bind(this);
    this.verifyCode        = this.verifyCode.bind(this);

    this.state = {
      devmode:          true,
      email:            '',
      verificationCode: '',
      message:          '',  
    };
  }

  verifyCode() {
    const cognitoUser = new CognitoUser({
      Username: this.state.email,
      Pool: userPool
    })
    cognitoUser.confirmRegistration(this.state.verificationCode, true, (err) => {
      if (err) {
        console.log(err)
        console.error(err)
        console.log(err['message'])
        this.setState({message: err['message']});  
        return
      }
      console.log('verification succeeded')
      this.setState({email: '' });
      this.setState({verificationCode: '' });
      this.setState({message: '' });
      this.props.history.push({ pathname: '/account' });
    })
  }

  handleChange1(e){
    this.setState({email: e.target.value });
  }

  handleChange2(e){
    this.setState({verificationCode: e.target.value });
  }

  render() {

    return (
      <div className="container-fluid AppBody">

        <div className="fixed-top">
          <div className="row AppHeader">
            <div className="col-6"><h4>Ikkoh ユーザー登録認証</h4></div>
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
          <span className="AppSignin">verificationCode</span>
          <input type="text" placeholder=''
            onChange={this.handleChange2}
            value={this.state.verificationCode}
            className="AppEmail"
          />
          <br/><br/>
          <span>{this.state.message}</span>
          <br/><br/>
          
          <button onClick={this.verifyCode}>認証</button>
        </div>

      </div>
    );
  }
}

export default withRouter(VerificationPage)  