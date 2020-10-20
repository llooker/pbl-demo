import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter, useHistory } from 'react-router-dom'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
// import Config from './clientConfig.json';
import Home from './components/Home'
import SignIn from './components/SignIn'
//make looker user dynamic
import LookerUserPermissions from './lookerUserPermissions.json';
import InitialLookerUser from './initialLookerUser.json';
import UsecaseContent from './usecaseContent.json';
import LookerUserAttributeBrandOptions from './lookerUserAttributeBrandOptions.json';

import { Looker40SDK, DefaultSettings } from "@looker/sdk";
import { PblSessionEmbed } from './LookerHelpers/pblsession'

export const lookerUserTimeHorizonMap = {
  'basic': 'last 182 days',
  'advanced': 'last 365 days',
  'premium': 'last 730 days' //before today
}

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  responseGoogle = (response) => {
    // debugger //from Jim
    if (response.error) {
      console.log('response.error', response.error)
    } else {
      this.props.applySession(response.profileObj)
    }
  }

  render() {

    const { from } = this.props.location.state || { from: { pathname: '/analytics' } } //needs work?
    const { pathname } = this.props.location
    const { userProfile } = this.props

    const googleClientId = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}.apps.googleusercontent.com`
    if (Object.keys(userProfile).length) {
      return (
        <div className="App">
          <Redirect to={from} />
        </div>
      )
    } else {
      return (
        <SignIn
          googleClientId={googleClientId}
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          usecaseFromUrl={usecaseHelper()}
        />
      )
    }
  }
}

const PrivateRoute = ({
  component: Component,
  lookerContent,
  userProfile,
  lookerUser,
  lookerHost,
  switchLookerUser,
  applySession,
  lookerUserAttributeBrandOptions,
  switchUserAttributeBrand,
  usecaseFromUrl,
  sdk,
  lookerTokenExpires,
  ...rest }) => (
    < Route {...rest} render={(props) => (
      Object.keys(userProfile).length ?
        <Component {...props}
          lookerContent={lookerContent}
          userProfile={userProfile}
          lookerUser={lookerUser}
          lookerHost={lookerHost}
          switchLookerUser={switchLookerUser}
          applySession={applySession}
          lookerUserAttributeBrandOptions={lookerUserAttributeBrandOptions}
          switchUserAttributeBrand={switchUserAttributeBrand}
          usecaseFromUrl={usecaseFromUrl}
          sdk={sdk}
          lookerTokenExpires={lookerTokenExpires}
        />
        : <Redirect to={{
          pathname: '/',
          state: { from: props.location }
        }} />
    )} />
  )

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: {},
      lookerUser: {
        ...InitialLookerUser
      },
      lookerHost: '',
      activeUsecase: '',
      // tokenLastRefreshed: '',
      sdk: '',
      lookerTokenExpires: ''
    }
  }

  // keep track of when user logs in
  // keep track of current time 
  // if current time > initial log in time plus buffer, logout
  // logoutTimer = () => {
  //   console.log('logoutTimer')
  //   console.log('this.state.lookerTokenExpires', this.state.lookerTokenExpires)
  //   let clientInterval = setInterval(async () => {
  //     let currentTime = Date.now();
  //     // let expiresInBuffer = 58 * 60 * 1000; //3480000; //58 minutes
  //     if (currentTime > (this.state.lookerTokenExpires)) {
  //       //force logout
  //       this.applySession({})
  //       clearInterval(clientInterval);
  //     }
  //   }, 1000)
  // }

  componentDidMount() {
    // console.log('App componentDidMount')
    this.checkSession()
  }

  //called on componentDidMount
  //get request so should only check info, never update
  checkSession = async () => {
    console.log('checkSession')
    // this.applySession({})
    let sessionResponse = await fetch('/readsession', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const sessionResponseData = await sessionResponse.json();
    console.log('sessionResponseData', sessionResponseData)
    const { userProfile } = sessionResponseData.session
    const lookerUser = sessionResponseData.session.lookerUser ? sessionResponseData.session.lookerUser : this.state.lookerUser;
    const lookerHost = sessionResponseData.session.lookerHost ? sessionResponseData.session.lookerHost : this.state.lookerHost;
    const accessToken = sessionResponseData.session.lookerApiToken ? sessionResponseData.session.lookerApiToken.api_user_token : '';
    //make sure defined and contains properties
    if (userProfile && Object.keys(userProfile).length) {

      const session = new PblSessionEmbed({
        ...DefaultSettings(),
        base_url: `https://${lookerHost}.looker.com:19999`,
        accessToken
      });


      let sdk = new Looker40SDK(session);



      this.setState((prevState) => ({
        userProfile, //think we want this here?
        lookerUser: {
          ...prevState.lookerUser,
          external_user_id: userProfile.email, //googleId
          first_name: userProfile.givenName,
          last_name: userProfile.familyName,
          permissions: LookerUserPermissions[lookerUser.user_attributes.permission_level] || LookerUserPermissions['basic'],
          user_attributes: {
            ...lookerUser.user_attributes || {
              "locale": "en_US",
              "country": "USA",
              "brand": "Calvin Klein",
              "permission_level": "basic"
            }
          }
        },
        lookerHost,
        // tokenLastRefreshed: sessionResponseData.session.lookerApiToken.api_token_last_refreshed || Date.now(),
        sdk,
        lookerTokenExpires: sessionResponseData.session.lookerApiToken.api_token_last_refreshed + 10000 //(sessionResponseData.session.lookerApiToken.api_user_token.expires_in * 1000)
      }), () => {
        // console.log('checkSession callback 1111 this.state.lookerUser', this.state.lookerUser)
        // this.logoutTimer();
      })
    }
  }

  // called by responseGoogle once it gets response
  applySession = async (userProfile) => {
    console.log('applySession')
    console.log('userProfile', userProfile)

    if (Object.keys(userProfile).length === 0) {
      // console.log('inside ifff')
      let sessionData = await fetch('/endsession', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      this.setState({
        userProfile: {},
        lookerUser: { ...InitialLookerUser }
      })
    } else {
      // console.log('inside else')
      let sessionData = await fetch('/writesession', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userProfile, lookerUser: this.state.lookerUser })
      })
      const sessionResponseData = await sessionData.json();
      console.log('sessionResponseData', sessionResponseData)
      const lookerUser = sessionResponseData.session.lookerUser ? sessionResponseData.session.lookerUser : this.state.lookerUser;
      const lookerHost = sessionResponseData.session.lookerHost ? sessionResponseData.session.lookerHost : this.state.lookerHost;
      const accessToken = sessionResponseData.session.lookerApiToken ? sessionResponseData.session.lookerApiToken.api_user_token : '';


      const session = new PblSessionEmbed({
        ...DefaultSettings(),
        base_url: `https://${lookerHost}.looker.com:19999`,
        accessToken
      });


      let sdk = new Looker40SDK(session);

      this.setState(prevState => ({
        userProfile,
        lookerUser: {
          ...prevState.lookerUser,
          external_user_id: userProfile.email, //googleId
          first_name: userProfile.givenName,
          last_name: userProfile.familyName,
          permissions: LookerUserPermissions[lookerUser.user_attributes.permission_level] || LookerUserPermissions['basic'], //assume good initially,
          user_attributes: {
            ...lookerUser.user_attributes || {
              "locale": "en_US",
              "country": "USA",
              "brand": "Calvin Klein",
              "time_horizon": "last 6 months",
              "permission_level": "basic",
            }
          }
        },
        lookerHost,
        // tokenLastRefreshed: sessionResponseData.session.lookerApiToken.api_token_last_refreshed || Date.now(),
        sdk,
        lookerTokenExpires: sessionResponseData.session.lookerApiToken.api_token_last_refreshed + 10000//(sessionResponseData.session.lookerApiToken.api_user_token.expires_in * 1000)
      }), () => {
        // this.logoutTimer()
      });
    }
  }

  switchLookerUser = (newUser) => {
    // console.log('switchLookerUser')
    // console.log('newUser', newUser)
    // console.log('LookerUserPermissions[newUser]', LookerUserPermissions[newUser])


    let userAttributeCopy = { ...this.state.lookerUser.user_attributes, "permission_level": newUser }
    userAttributeCopy.time_horizon = lookerUserTimeHorizonMap[newUser];


    this.setState(prevState => ({
      lookerUser: {
        ...prevState.lookerUser,
        permissions: LookerUserPermissions[newUser],
        user_attributes: userAttributeCopy
      }
    }), async () => {

      let lookerUserResponse = await fetch('/updatelookeruser', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.lookerUser)
      })

      let lookerUserResponseData = await lookerUserResponse.json();

    });
  }

  switchUserAttributeBrand = (newAttribute) => {
    // console.log('switchUserAttributeBrand')
    // console.log('newAttribute', newAttribute)

    let userAttributeCopy = { ...this.state.lookerUser.user_attributes }
    userAttributeCopy.brand = newAttribute;

    let usecaseFromUrl = usecaseHelper();

    this.setState(prevState => ({
      lookerUser: {
        ...prevState.lookerUser,
        user_attributes: userAttributeCopy,
        group_ids: [UsecaseContent[usecaseFromUrl].groupIds[newAttribute.replace("'", "")]] //needed to replace apostrophe
      }
    }), async () => {
      let lookerUserResponse = await fetch('/updatelookeruser', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.lookerUser)
      })

      let lookerUserResponseData = await lookerUserResponse.json();

    });
  }

  render() {
    // console.log('App render');
    // console.log('this.props', this.props);
    const { userProfile, lookerContent, lookerUser, lookerHost, accessToken, sdk, lookerTokenExpires } = this.state;


    let usecaseFromUrl = usecaseHelper();

    return (
      <Router>
        <div>
          <Route path='' render={(props) => <Login
            {...props}
            applySession={this.applySession}
            userProfile={userProfile}
            lookerUser={lookerUser}
            switchLookerUser={this.switchLookerUser}
            lookerHost={lookerHost}
          />}
          />
          <PrivateRoute path='/analytics' component={Home}
            lookerContent={lookerContent}
            userProfile={userProfile}
            lookerUser={lookerUser}
            applySession={this.applySession}
            lookerHost={lookerHost}
            switchLookerUser={this.switchLookerUser}
            lookerUserAttributeBrandOptions={LookerUserAttributeBrandOptions}
            switchUserAttributeBrand={this.switchUserAttributeBrand}
            usecaseFromUrl={usecaseFromUrl}
            sdk={sdk}
            lookerTokenExpires={lookerTokenExpires}
          />
        </div>
      </Router>
    )
  }
}
export default App

export function usecaseHelper() {
  let keyArr = Object.keys(UsecaseContent);
  let url = window.location.href;
  for (let i = 0; i < keyArr.length; i++) {
    if (url.indexOf(keyArr[i]) > -1) {
      return keyArr[i];
    }
  }
  return 'atom';
}

