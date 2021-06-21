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
    this.signup            = this.signup.bind(this);
    this.signout           = this.signout.bind(this);
    this.account           = this.account.bind(this);
    this.test              = this.test.bind(this);

    this.state             = this.props.state;
    // this.state = {
    //   devmode:  true,
    //   username: username, 
    // };
  }
 
  signin() {
    this.props.history.push({ pathname: '/signin' });  
  }

  signup(){
    this.props.history.push({ pathname: '/signup' });  
  }

  signout(){
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      cognitoUser.signOut()
      localStorage.clear()
      console.log('signed out')
      this.props.history.push({ pathname: '/' });  
    } else {
      localStorage.clear()
      console.log('no user signing in')
    }
  }

  account() {
    this.props.history.push({
      pathname: '/account',
    });
  }

  test() {
    this.props.history.push({ pathname: '/test' });
  }


  render() {
      return (
        <div className="row AppHeader">
          <div className="col-6"><h4>Ikkoh's Choice</h4></div>
          <div className="col-6 row">
            {this.props.state.username &&
              <div onClick={this.account}>アカウント:{this.props.state.username}({this.props.state.devmode.toString()})</div>
            }
            {this.props.state.username &&
              <button type="button" className="btn btn-primary m-1" onClick={this.signout}>ログアウト</button>
            }
            {!this.props.state.username &&
              <button type="button" className="btn btn-primary m-1" onClick={this.signin}>ログイン</button>
            }
            {!this.props.state.username &&
              <button type="button" className="btn btn-primary m-1" onClick={this.signup}>ユーザー登録（無料）</button>
            }
            {this.props.state.devmode &&
              <button type="button" className="btn btn-primary m-1" onClick={this.test}>TEST</button>
            }
          </div>
        </div>
      );
    
  }
}
export default withRouter(Header) // 画面遷移対象にするので、withRoute()を使う