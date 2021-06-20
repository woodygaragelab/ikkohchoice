import React from 'react';
import { Component } from 'react';
import './App.css';
import './listpage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';

class TestPage extends Component {

  constructor(props){
    super(props);
    this.handleChange1     = this.handleChange1.bind(this);
    this.test              = this.test.bind(this);
    this.state = {
      text:  '',
      result: ''
    };
  }

  handleChange1(e){
    this.setState({text: e.target.value });
  }

  test() {
    console.log('test')
    this.setState({result: this.state.text})
  }

  render() {

    return (
      <div className="container-fluid AppBody">

        <div className="fixed-top">
          <div className="row AppHeader">
            <div className="col-6"><h4>Test</h4></div>
          </div>
        </div>

        <div className="AppFiller">x</div>

        <div className="form-group">

          <span className="AppSignin">Text</span>
          <input
            type='text' id="text" 
            onChange={this.handleChange1}
            placeholder=""
            value={this.state.text}
            className="text"
          />
          <br/>

          <span className="AppSignin">Result</span>
          <input
            type='text' id="text" 
            readOnly
            placeholder=""
            value={this.state.result}
            className="text"
          />
          <br/>
          <br/><br/>
          <button onClick={this.test}>TEST</button>
        </div>

      </div>
    );
  }
}

export default withRouter(TestPage)  