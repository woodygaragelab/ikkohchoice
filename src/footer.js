// 未使用
import React from 'react'
import { Component } from 'react';
import { withRouter } from 'react-router-dom';              // router (画面遷移制御)機能

import './App.css';                  // アプリ共通StyleSheet。kzXxxxx のスタイルはすべてここで定義する
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // アイコン表示機能
import { faHeart, faHome, faChartLine, faComments, faUser } from "@fortawesome/free-solid-svg-icons"; // Heart,Home,Graph,Messageのアイコン

class Footer extends Component {       // Footer: コンポネント
  constructor(props){                    // props: Footerコンポネントが受け取るパラメータ
    super(props);
    this.state = { };                    // state: Footerコンポネントが保持するデータ
  }

  // pathname:xxxに遷移する。遷移先のコンポネントはApp.jsのRouteで設定　
  selectHome = () => {  this.props.history.push({ pathname: '/homepage' });  }
  selectGraph = () => {  this.props.history.push({ pathname: '/graphpage' });  }
  selectText  = () => {  this.props.history.push({ pathname: '/textpage' });  }
  selectHeart = () => {  this.props.history.push({ pathname: '/heartpage' });  }
  selectUser = () => {  this.props.history.push({ pathname: '/userpage' });  }

  //隠しボタンで起動するlogin
  // 要修正
  login() {
    // this.setState({isLoggedIn: !this.state.isLoggedIn});
    this.setState({devmode: !this.state.devmode,
                  username: this.state.username    //"login"
                  });
  }


  // 画面描画処理。 htmlを生成してreturnすると、Reactが描画する。
  render() {
    return (
      <div>
        {/***** Footer部 *****/}
        <footer className="kzFooter kzColor2 kzFont1">
          <FontAwesomeIcon icon={faHome}      onClick={this.selectHome} />     {/* faHome:Homeアイコン */}
          <FontAwesomeIcon icon={faChartLine} onClick={this.selectGraph}/>{/* faChartLine:グラフアイコン*/}
          <FontAwesomeIcon icon={faHeart}     onClick={this.selectHeart}/>  {/* selectHeart関数で画面遷移する */}
          <FontAwesomeIcon icon={faComments}  onClick={this.selectText}/> {/* selectText関数で画面遷移する*/}
          <FontAwesomeIcon icon={faUser}      onClick={this.selectUser}/>
        </footer>
      </div>
    );
  }
}
export default withRouter(Footer) // 画面遷移対象にするので、withRoute()を使う