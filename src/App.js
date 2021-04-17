import React from 'react';
import './App.css';
//import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
//import { Auth } from 'aws-amplify';

import 'bootstrap/dist/css/bootstrap.min.css';
import ListPageBook from './listpagebook';
import ListPageFood from './listpagefood';
import DetailPage from './detailpage';
import { BrowserRouter as Router } from 'react-router-dom';
import {Route, Switch} from 'react-router-dom';

class App extends React.Component {

  render(){
    return (
      <div className="App">
        <div>
        <Router>
        <Switch>
            <Route exact={true} path='/' component={ListPageBook}/>
            <Route exact={true} path='/listpagebook' component={ListPageBook}/>
            <Route exact={true} path='/listpagefood' component={ListPageFood}/>
            <Route exact={true} path='/detailpage' component={DetailPage}/>
        </Switch>
        </Router>
        </div>      
      {/* <AmplifySignOut /> */}
    </div>

  )};
}

//export default withAuthenticator(App);
export default App;
