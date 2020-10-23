import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Home from './components/Home';
import SignIn from './components/SignIn';
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
  checkToken,
  corsApiCall,
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
          corsApiCall={corsApiCall}
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
      sdk: '',
      lookerTokenExpires: ''
    }
  }

  componentDidMount() {
    // console.log('App componentDidMount')
    this.checkSession()
  }

  checkSession = async () => {
    // console.log('checkSession')
    // this.applySession({}) //force logout
    let sessionResponse = await fetch('/readsession', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const sessionResponseData = await sessionResponse.json();
    // console.log('sessionResponseData', sessionResponseData)
    const { userProfile } = sessionResponseData.session
    const lookerUser = sessionResponseData.session.lookerUser ? sessionResponseData.session.lookerUser : this.state.lookerUser;
    const lookerHost = sessionResponseData.session.lookerHost ? sessionResponseData.session.lookerHost : this.state.lookerHost;
    const accessToken = sessionResponseData.session.lookerApiToken ? sessionResponseData.session.lookerApiToken.api_user_token : '';
    const lookerTokenExpires = sessionResponseData.session.lookerApiToken.api_token_last_refreshed + (sessionResponseData.session.lookerApiToken.api_user_token.expires_in * 1000)
    // const lookerTokenExpires = sessionResponseData.session.lookerApiToken.api_token_last_refreshed + 10000;

    //make sure defined and contains properties
    if (userProfile && Object.keys(userProfile).length) {
      // console.log('000 this.state.sdk', this.state.sdk)
      //do we want to do this everytime client loads or save in session somehow?
      let sdk = createSdkHelper({ lookerHost, accessToken })
      // console.log('1111 sdk', sdk)

      this.setState((prevState) => ({
        userProfile,
        lookerUser: {
          ...prevState.lookerUser,
          external_user_id: userProfile.email,
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
        sdk,
        lookerTokenExpires
      }), () => {
        // console.log('checkSession callback 1111 this.state.lookerUser', this.state.lookerUser)
        // console.log('this.state.sdk', this.state.sdk)
        // console.log('this.state.lookerTokenExpires', this.state.lookerTokenExpires)
      })
    }
  }

  // called by responseGoogle once it gets response
  applySession = async (userProfile) => {
    // console.log('applySession')
    // console.log('userProfile', userProfile)

    if (Object.keys(userProfile).length === 0) {
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
      // console.log('sessionResponseData', sessionResponseData)
      const lookerUser = sessionResponseData.session.lookerUser ? sessionResponseData.session.lookerUser : this.state.lookerUser;
      const lookerHost = sessionResponseData.session.lookerHost ? sessionResponseData.session.lookerHost : this.state.lookerHost;
      const accessToken = sessionResponseData.session.lookerApiToken ? sessionResponseData.session.lookerApiToken.api_user_token : '';
      const lookerTokenExpires = sessionResponseData.session.lookerApiToken.api_token_last_refreshed + (sessionResponseData.session.lookerApiToken.api_user_token.expires_in * 1000)
      // const lookerTokenExpires = sessionResponseData.session.lookerApiToken.api_token_last_refreshed + 10000;

      let sdk = createSdkHelper({ lookerHost, accessToken })

      this.setState(prevState => ({
        userProfile,
        lookerUser: {
          ...prevState.lookerUser,
          external_user_id: userProfile.email,
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
        sdk,
        lookerTokenExpires
      }), () => {
        // console.log('this.state.sdk', this.state.sdk)
        // console.log('this.state.lookerTokenExpires', this.state.lookerTokenExpires)
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

  corsApiCall = async (func, args = []) => {
    // console.log('corsApiCall');
    // console.log({ func });
    // console.log({ args });
    await this.checkToken()
    let res = func(...args)
    return res
  }

  checkToken = async () => {
    if (Date.now() > this.state.lookerTokenExpires) {
      let sessionResponse = await fetch('/refreshlookertoken', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      let sessionResponseData = await sessionResponse.json();
      const lookerHost = sessionResponseData.session.lookerHost ? sessionResponseData.session.lookerHost : this.state.lookerHost;
      const accessToken = sessionResponseData.session.lookerApiToken ? sessionResponseData.session.lookerApiToken.api_user_token : '';
      const lookerTokenExpires = sessionResponseData.session.lookerApiToken.api_token_last_refreshed + (sessionResponseData.session.lookerApiToken.api_user_token.expires_in * 1000)
      // const lookerTokenExpires = sessionResponseData.session.lookerApiToken.api_token_last_refreshed + 10000;

      let sdk = createSdkHelper({ lookerHost, accessToken })

      this.setState({
        sdk,
        lookerTokenExpires
      })
    }
  }

  render() {

    const { userProfile, lookerContent, lookerUser, lookerHost,
      sdk } = this.state;


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
            corsApiCall={this.corsApiCall}
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

export function createSdkHelper({ accessToken, lookerHost }) {

  // console.log('createSdkHelper')
  // console.log('accessToken', accessToken)
  // console.log('lookerHost', lookerHost)

  const session = new PblSessionEmbed({
    ...DefaultSettings(),
    base_url: `https://${lookerHost}.looker.com:19999`,
    accessToken
  });
  // console.log('session', session)

  let sdk = new Looker40SDK(session);
  return sdk;
}

