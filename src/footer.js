import React from 'react'
import { Component } from 'react';
import { withRouter } from 'react-router-dom';              // router (画面遷移制御)機能
import './App.css';                    // アプリ共通StyleSheet。スタイルはすべてここで定義する

class Footer extends Component {       // Footer: コンポネント
  constructor(props){                  // props: Footerコンポネントが受け取るパラメータ
    super(props);
    this.state = {
      devmode: true,
      username: "",
     };                    // state: Footerコンポネントが保持するデータ
  }

  render() {
    return (
      <div style={{marginTop: 100}}  className="container-fluid">
      <div className="row">
        <div className="col-10"/>
        <div className="col-2 AppFooter">
          <button type="button" onClick={() => this.props.handleLogin()} className="btn AppButton2"/>
          <h6>20210606</h6>
        </div>
      </div>              
      </div> 
    );
  }
}
export default withRouter(Footer) // 画面遷移対象にするので、withRoute()を使う