import React from 'react';
import { Component } from 'react';
import ListPage from './listpage'       
import { withRouter } from 'react-router-dom';

class ListPageBook extends Component {

  render() {
    return ( <ListPage category="book"/> );
  }
}

export default withRouter(ListPageBook)  
      