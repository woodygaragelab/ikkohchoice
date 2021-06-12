import React from 'react';
import { Component } from 'react';
import ListPage from './listpage'       
import { withRouter } from 'react-router-dom';

class ListPageLife extends Component {

  render() {
    return ( <ListPage category="life"/> );
  }
}

export default withRouter(ListPageLife)  
      