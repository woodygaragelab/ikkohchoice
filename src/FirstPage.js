import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class FirstPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      text: '',
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleChange(e){
    this.setState({
      text: e.target.value
    })
  }

  handleClick(){
    this.props.history.push('/secondpage')
  }

  render() {
    return (
      <div>
        最初のページ
        <br/>
        <input type='text' value={this.state.text} onChange={this.handleChange}></input>
        <p>{this.state.text}</p>
        <button onClick={this.handleClick}>画面遷移します</button>
      </div>
    );
  }
}

export default withRouter(FirstPage)
