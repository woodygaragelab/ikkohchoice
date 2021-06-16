import { React, Component } from 'react';
import { withRouter } from 'react-router-dom';              // router (画面遷移制御)機能
import './App.css';                    // アプリ共通StyleSheet。スタイルはすべてここで定義する
import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration    from './awsConfiguration'
const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId:   awsConfiguration.ClientId,
})

class Header extends Component {       
  constructor(props){                  
    super(props);
    this.signin            = this.signin.bind(this);
    this.signout           = this.signout.bind(this);
    this.account           = this.account.bind(this);

    this.state             = this.props.state;
    // this.state = {
    //   devmode:  true,
    //   username: username, 
    // };
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

  account() {
    this.props.history.push({
      pathname: '/account',
      //pathname: "https://ikkohchoice232927-staging.s3-ap-northeast-1.amazonaws.com/public/pay.html"
    });
  }


  render() {
      return (
        <div className="row AppHeader">
          <div className="col-6"><h4>Ikkoh's Choice</h4></div>
          <div className="col-4 AppRight" onClick={this.account}>アカウント:{this.props.state.username}({this.props.state.devmode.toString()})</div>
          <div className="col-1 AppRight" onClick={this.signin}>SignIn</div>
          <div className="col-1 AppRight" onClick={this.signout}>SignOut</div>
        </div>
      );
    
  }
}
export default withRouter(Header) // 画面遷移対象にするので、withRoute()を使う