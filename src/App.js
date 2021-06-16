import React from 'react';
import './App.css';
//import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
//import { Auth } from 'aws-amplify';

import 'bootstrap/dist/css/bootstrap.min.css';
import ListPageIllust from './listpageillust';
import ListPageBook   from './listpagebook';
import ListPageFood   from './listpagefood';
import ListPageLife   from './listpagelife';
import ListPage       from './listpage';
import DetailPage     from './detailpage';
import SignInPage     from './signinpage';
import Cancel         from './cancel';
import Account        from './account';

import { BrowserRouter as Router } from 'react-router-dom';
import {Route, Switch} from 'react-router-dom';

class App extends React.Component {

  render(){
    return (
      <div className="App">
        <div>
        <Router>
        <Switch>
            <Route exact={true} path='/'               component={ListPageBook}/>
            <Route exact={true} path='/listpageillust' component={ListPageIllust}/>
            <Route exact={true} path='/listpage'       component={ListPage}/>
            <Route exact={true} path='/listpagebook' component={ListPageBook}/>
            <Route exact={true} path='/listpagefood' component={ListPageFood}/>
            <Route exact={true} path='/listpagelife' component={ListPageLife}/>
            <Route exact={true} path='/detailpage' component={DetailPage}/>
            <Route path='/pay' component={() => { 
              window.location.href = 'https://ikkohchoice232927-staging.s3-ap-northeast-1.amazonaws.com/public/pay.html'; 
              return null;
            }}/>
            <Route exact={true} path='/account' component={Account}/>
            <Route exact={true} path='/success' component={ListPageIllust}/>
            <Route exact={true} path='/cancel' component={Cancel}/>
            <Route exact={true} path='/signin'       component={SignInPage}/>
        </Switch>
        </Router>
        </div>      
      {/* <AmplifySignOut /> */}
    </div>

  )};
}

//export default withAuthenticator(App);
export default App;
