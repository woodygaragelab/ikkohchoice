import React from 'react'
import './App.css'
import { withRouter } from 'react-router-dom';
//import history from 'history/createBrowserHistory';

import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from "amazon-cognito-identity-js"
import awsConfiguration from './awsConfiguration'

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})

const SignIn = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const changedEmailHaldler = (e) => setEmail(e.target.value)
  const changedPasswordHandler = (e) => setPassword(e.target.value)

  const signIn = () => {
    const authenticationDetails = new AuthenticationDetails({
      Username : email,
      Password : password
    })
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    })

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('result: ' + result)
        const accessToken = result.getAccessToken().getJwtToken()
        console.log('AccessToken: ' + accessToken)
        setEmail('')
        setPassword('')
      },
      onFailure: (err) => {
        console.error(err)
      }

    })
    //history.push({ pathname: '/listpageillust' });  
  }

  return (
    <div className="SignIn">
      {/* <h1>SingIn</h1> */}
      <input type="text" placeholder='email' onChange={changedEmailHaldler}/>
      <input type="text" placeholder='password' onChange={changedPasswordHandler}/>
      <button onClick={signIn}>Sign In</button>
    </div>
    // <AmplifySignIn/>
    )
}

export default withRouter(SignIn)