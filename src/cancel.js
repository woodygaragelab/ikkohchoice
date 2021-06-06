import React from 'react';
import { Component } from 'react';
import './App.css';
import './listpage.css';
//import { Storage } from 'aws-amplify';

import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';

import {
  CognitoUserPool,
} from "amazon-cognito-identity-js"
import awsConfiguration from './awsConfiguration'
const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId:   awsConfiguration.ClientId,
})

const initialItemState = [{ name: 'initial', description: 'item state' }]

class Cancel extends Component {

  constructor(props){
    super(props);
    this.return = this.return.bind(this);

    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    const customerId = this.getStripeCustomerBySessionId(sessionId);


    const username = this.get_user();
    this.state = {
      // isLoggedIn: false,
      devmode: true,
      username: username, 
      items: initialItemState,
      category: "illust",
      sesisonId: sessionId,
      customerId: customerId

    };
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3";
    script.async = true;
    document.body.appendChild(script);
  }

  get_user() {
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      // sign inしている状態
      console.log('signing in');
      console.log(cognitoUser);
      //this.setState({devmode: 2, //!this.state.devmode,
      //  username: cognitoUser.username
      //});
      return cognitoUser.username;
    } else {
      // sign inしていない状態
      console.log('no signing in');
      return 'no user';
    }
  }

  /**
  * Session IDからStripe Customerのデータを引き出す
  **/
  // 未完成
  //export const getStripeCustomerBySessionId = async (sessionId: string) => {
  // async getStripeCustomerBySessionId(sessionId) {
  //   const session = await stripe.checkout.sessions.retrieve(sessionId);
  //   if (!session || !session.customer) throw new Error('No such customer');
  //   const customerId =
  //     typeof session.customer === 'string'
  //       ? session.customer
  //       : session.customer.id;
  //   const customer = await this.stripe.customers.retrieve(customerId);
  //   return customer
  // }

  return() {
    this.props.history.push({
      pathname: '/account',
    });
  }

  render() {

    return (
      <div className="mt-5 container-fluid">
        <header className="fixed-top">
          <div className="row bg-color-1">
            <div className="col-8">Ikkohのイラスト({this.state.devmode})</div>
            <div className="col-4" onClick={this.account}>アカウント:{this.state.username}</div>
          </div>
        </header>

        <div className="bg-color-2">
          <h4>支払いはキャンセルされました。</h4>
          <h4>sessionid:{this.state.sessoinId}</h4>
          <h4>customerid:{this.state.customerId}</h4>
        </div>              

        <div style={{marginTop: 100}}  className="container-fluid">
        <div className="row">
            <button type="button" onClick={this.return} className="btn btn-primary">
                戻る
            </button>
        </div>              
        </div> 

      </div>
    );
  }
}

export default withRouter(Cancel)  
      