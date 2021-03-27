import React from 'react';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
//import { Auth } from 'aws-amplify';

import 'bootstrap/dist/css/bootstrap.min.css';
import ListPage from './listpage';
import DetailPage from './detailpage';
import { BrowserRouter as Router } from 'react-router-dom';
import {Route, Switch} from 'react-router-dom';

class App extends React.Component {

  render(){
    return (
      // <head>
      //   <script src="https://kit.fontawesome.com/a87609860b.js" crossOrigin="anonymous"></script>
      // </head>

      <div className="App">
        <div>
        <Router>
        <Switch>
            <Route exact={true} path='/' component={ListPage}/>
            <Route exact={true} path='/detailpage' component={DetailPage}/>
        </Switch>
        </Router>
        </div>
      
      <AmplifySignOut />
    </div>

  )};
}

//export default withAuthenticator(App);
export default App;
