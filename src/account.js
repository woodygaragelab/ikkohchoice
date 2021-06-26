import React from 'react';
import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';
import './App.css';
import './listpage.css';

import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration    from './awsConfiguration'
const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId:   awsConfiguration.ClientId,
})


class Account extends Component {

  constructor(props){
    super(props);
    this.onChangeUser         = this.onChangeUser.bind(this);
    this.onChangeSubscription = this.onChangeSubscription.bind(this);
    this.onClickPlan          = this.onClickPlan.bind(this);
    this.onClickReturn        = this.onClickReturn.bind(this);

    const username         = this.get_user();
    
    
    this.state = {
      devmode:      true,
      username:     username,
      subscription: "0",
    };
  }

  get_user() {
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      console.log(cognitoUser);
      
      cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
            //$(location).attr("href", "signin.html");
        }
        console.log(result);
        
        // 取得した属性情報を連想配列に格納
        // for (i = 0; i < result.length; i++) {
        //     currentUserData[result[i].getName()] = result[i].getValue();
        // }
        // $("div#menu h1").text("ようこそ！" + currentUserData["family_name"] + "さん");
    });

      
      return cognitoUser.username;
    } else {
      return '';
    }
  }

  // componentDidMount() {
  //   const script = document.createElement("script");
  //   script.src = "https://js.stripe.com/v3";
  //   script.async = true;
  //   document.body.appendChild(script);
  // }
 
  onChangeUser(e)        { this.setState({username: e.target.value });      }
  onChangeSubscription(e){ this.setState({subscription: e.target.value });  }
  onClickPlan(e){
    this.setState({subscription: "1" });
    this.props.history.push({ pathname: '/pay' });  
  }
  onClickReturn(){
    this.props.history.push({ pathname: '/' });  
  }

  render() {
    return (
      <div className="mt-5 container-fluid">
        <header className="fixed-top AppBgH">
          <div className="AppBody"><h4>Ikkoh アカウント</h4></div>
        </header>

          <div className="form-group">
            <label for="itemname">AccountID (email)</label>
            <input
              type='text' className="form-control col-3" id="username" 
              readOnly
              placeholder="email"
              value={this.state.username}
            />
          </div>
          <div className="form-group">
            <label for="subscription">プラン</label>
            <input
              type='text' className="form-control col-3" id="subscription" 
              readOnly
              placeholder="subscriptoin"
              value={this.state.subscription==="1"?"有料プラン":"無料プラン"}
            />
          </div>

          <div className="button">
            <button type="button" className="btn btn-primary m-1" onClick={this.onClickPlan}>有料プランへ変更</button>
            <button type="button" className="btn btn-primary m-1" onClick={this.onClickReturn}>戻る</button>
          </div>

      </div>
    );
  }
}

export default withRouter(Account)  