import { React, Component } from 'react';
import { withRouter } from 'react-router-dom';              // router (画面遷移制御)機能
import './App.css';                    // アプリ共通StyleSheet。スタイルはすべてここで定義する

class TabGroup extends Component {       
  constructor(props){                  
    super(props);
    this.selectIllust      = this.selectIllust.bind(this);
    this.selectBook        = this.selectBook.bind(this);
    this.selectFood        = this.selectFood.bind(this);
    this.selectLife        = this.selectLife.bind(this);
    this.state = {
    };
  }

  selectIllust() {  this.props.history.push({ pathname: '/listpageillust' });  }
  selectBook()   {  this.props.history.push({ pathname: '/listpagebook' });  }
  selectFood()   {  this.props.history.push({ pathname: '/listpagefood' });  }
  selectLife()   {  this.props.history.push({ pathname: '/listpagelife' });  }
  
  render() {
   if (this.props.category==="book") {
      return (
        <div className="AppTabGroup">
          {this.props.devmode &&
            <div onClick={this.selectIllust} className="col-3 AppTabUnselected">イラスト</div>
          }
          <div onClick={this.selectBook}   className="col-3 AppTabSelected">書籍</div>
          <div onClick={this.selectFood}   className="col-3 AppTabUnselected">食品</div>
          <div onClick={this.selectLife}   className="col-3 AppTabUnselected">生活</div>
        </div>
      );
    }
    else if (this.props.category==="food") {
      return (
        <div className="AppTabGroup">
          {this.props.devmode &&
            <div onClick={this.selectIllust} className="col-3 AppTabUnselected">イラスト</div>
          }
          <div onClick={this.selectBook}   className="col-3 AppTabUnselected">書籍</div>
          <div onClick={this.selectFood}   className="col-3 AppTabSelected">食品</div>
          <div onClick={this.selectLife}   className="col-3 AppTabUnselected">生活</div>
        </div>
      );
    }
    else if (this.props.category==="life") {
      return (
        <div className="AppTabGroup">
          {this.props.devmode &&
            <div onClick={this.selectIllust} className="col-3 AppTabUnselected">イラスト</div>
          }
          <div onClick={this.selectBook}   className="col-3 AppTabUnselected">書籍</div>
          <div onClick={this.selectFood}   className="col-3 AppTabUnselected">食品</div>
          <div onClick={this.selectLife}   className="col-3 AppTabSelected">生活</div>
        </div>
      );
    }
    else {
      return (
        <div className="AppTabGroup AppBody">
          <div onClick={this.selectIllust} className="col-1 AppTabUnselected">イラスト</div>
          <div onClick={this.selectBook}   className="col-6 AppTabUnselected">書籍</div>
          <div onClick={this.selectFood}   className="col-6 AppTabUnselected">食品</div>
          <div onClick={this.selectLife}   className="col-3 AppTabUnselected">生活</div>
        </div>
      );
    }
    
  }
}
export default withRouter(TabGroup) // 画面遷移対象にするので、withRoute()を使う