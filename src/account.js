import React from 'react';
import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';
//import Button from 'react-bootstrap/Button';

import './App.css';
import './listpage.css';

class Account extends Component {

  constructor(props){
    super(props);
    this.onChangeUser         = this.onChangeUser.bind(this);
    this.onChangeSubscription = this.onChangeSubscription.bind(this);
    // this.onClickPay           = this.onClickPay.bind(this);
    this.onClickPlan          = this.onClickPlan.bind(this);
    this.state = {
      devmode:      true,
      username:     "aaa",
      subscription: "0",
    };
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3";
    script.async = true;
    document.body.appendChild(script);
  }
 
  onChangeUser(e)        { this.setState({username: e.target.value });      }
  onChangeSubscription(e){ this.setState({subscription: e.target.value });  }
  onClickPlan(e){
    this.setState({subscription: "1" });
    this.props.history.push({ pathname: '/pay' });  
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
            <button type="button" className="btn btn-primary" onClick={this.onClickPlan}>有料プランへ変更</button>
          </div>

      </div>
    );
  }
}

export default withRouter(Account)  
      