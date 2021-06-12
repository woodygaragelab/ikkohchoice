import React from 'react';
import { Component } from 'react';
import ListPage from './listpage'        // コンポネント（部品）化したFooter
import { withRouter } from 'react-router-dom';

class ListPageFood extends Component {

  render() {
    return ( <ListPage category="food"/> );
  }
}

export default withRouter(ListPageFood)  