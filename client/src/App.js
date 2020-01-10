import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import Home from './components/Home'


//unncessary?
//to discuss with wes -- how can I eliminate this
const auth = {
  isAuthenticated: false,
  authenticated(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) //fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100)
  }
}


class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  responseGoogle = (response) => {
    if (response.error) {
    } else {
      auth.authenticated()
      this.props.applySession(response.profileObj)
    }
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/home' } }
    const { userProfile } = this.props
    // if (Object.keys(userProfile).length) {
    if (auth.isAuthenticated === true) {
      return (
        <>
          <GoogleLogout
            clientId="1026815692414-cdeeupbmb7bbjcmfovmr6bqktsi86c2u.apps.googleusercontent.com"
            buttonText="Logout"
            onLogoutSuccess={() => { this.props.applySession({}) }} //send blank object
          >
          </GoogleLogout>
          <Redirect to={from} />
        </>
      )
    } else {
      return (
        <div className="fade">
          <h1>You need to login</h1>
          <GoogleLogin
            clientId="1026815692414-cdeeupbmb7bbjcmfovmr6bqktsi86c2u.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
        </div>
      )
    }
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  < Route {...rest} render={(props) => (
    auth.isAuthenticated === true ? <Component {...props} /> : <Redirect to={{
      pathname: '/', state: {
        from: props.location
      }
    }} />
  )} />
)

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: {}
    }
  }

  componentDidMount() {
    console.log('App componentDidMount')
    this.checkForSession()
  }

  checkForSession = async () => {
    console.log('checkForSession')
    let sessionResponse = await fetch('/session', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    let sessionResponseData = await sessionResponse.json();
    console.log('sessionResponseData', sessionResponseData)
    const { userProfile } = sessionResponseData.session
    console.log('userProfile', userProfile)
    //make sure defined and contains properties
    if (userProfile && Object.keys(userProfile).length) {
      auth.authenticated(() => {
        this.setState({
          userProfile
        }, () => {
          console.log('checkForSession callback')
          console.log('this.state.userProfile', this.state.userProfile)

        })
      })
    } else { console.log('else') }
  }

  applySession = (userProfile) => {
    console.log('applySession')
    console.log('userProfile', userProfile)
    fetch('/writesession', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userProfile)
    }).then(response => {
      if (response.status === 200) {
        if (Object.keys(userProfile).length == 0) {
          auth.signout()
        }
        this.setState({
          userProfile
        }, () => {
          console.log('applySession callback')
          console.log('this.state.userProfile', this.state.userProfile)
        });
      }
    });
  }

  render() {
    const { userProfile } = this.state
    return (
      <Router>
        <div>
          <Route extact path='/' render={(props) => <Login {...props} applySession={this.applySession} userProfile={userProfile} />} />
          <PrivateRoute path='/home' component={Home} />
        </div>
      </Router>
    )
  }
}
export default App