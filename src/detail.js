import React, { Component } from 'react';
//import { withRouter } from 'react-router-dom';

class Detail extends Component{
  constructor(props) {
    super(props);
    //this.handleChange1 = this.handleChange1.bind(this)
    //this.handleChange2 = this.handleChange2.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      text1: "",
      text2: ""
    }
  }

  //handleChange1(e){
  //  this.setState({
  //    text1: e.target.value
  //  })
  //}

  //handleChange2(e){
  //  this.setState({
  //    text2: e.target.value
  //  })
  //}

//   handleClick() {
//     this.props.history.push({
//       pathname: '/list',
//       state: { 
//         text1: this.state.text1,
//         text2: this.state.text2
//       }
//     });
//   }

  render(){
    return(
      <div>
        詳細ページ
        {/* <br/>
        <input type='text' value={this.state.text1} onChange={ (e) => this.handleChange1(e) }></input>
        <p>{this.state.text1}</p>
        <input type='text' value={this.state.text2} onChange={ (e) => this.handleChange2(e) }></input>
        <p>{this.state.text2}</p>
        <button onClick={this.handleClick}>内容確認</button> */}
      </div>
    )
  }
}

export default withRouter(Detail);