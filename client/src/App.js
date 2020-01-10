import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import Home from './components/Home'


//unncessary?
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
    this.state = {
      redirectToRefer: false,
    };
  }

  componentDidMount() {
    console.log('Login componentDidMount')
    console.log('this.props', this.props)
  }

  responseGoogle = (response) => {
    if (response.error) {
    } else {
      auth.authenticated(() => {
        this.setState(() => ({
          redirectToRefer: true,
        }))
      })

      this.props.applySession(response.profileObj)
    }
  }

  render() {
    const { redirectToRefer } = this.state
    const { from } = this.props.location.state || { from: { pathname: '/home' } }
    console.log('redirectToRefer', redirectToRefer)
    console.log('from', from)
    if (redirectToRefer === true) {
      return (
        <Redirect to={from} />
      )
    } else {
      return (
        <div>
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

const AuthStatus = withRouter(({ history }) => (
  auth.isAuthenticated === true
    ?
    <p>
      Welcome!
      <GoogleLogout
        clientId="1026815692414-cdeeupbmb7bbjcmfovmr6bqktsi86c2u.apps.googleusercontent.com"
        buttonText="Logout"
        onLogoutSuccess={() => { auth.signout(() => history.push('/')) }}
      >
      </GoogleLogout>
    </p >
    :
    <p>
      You are not logged in
    </p>
))

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
    if (sessionResponseData.session.userProfile) {
      console.log('inside ifff')
      this.setState({
        userProfile: sessionResponseData.session.userProfile
      })
    } else console.log("elllse")
  }

  applySession = (userProfileFromSignIn) => {
    console.log('applySession')
    console.log('userProfileFromSignIn', userProfileFromSignIn)
    fetch('/writesession', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userProfileFromSignIn)
    }).then(response => {
      console.log('response', response)
      if (response.status === 200) {
        console.log('inside ifff')
        this.setState({
          userProfile: userProfileFromSignIn
        }, () => {
          console.log('applySession callback')
          console.log('111 this.state.userProfile', this.state.userProfile)
        });
      }
    });
  }

  render() {
    console.log('App render')
    const { userProfile } = this.state
    console.log('userProfile', userProfile)
    return (
      <Router>
        <div>
          <AuthStatus />
          {/* call login */}
          <Route extact path='/' render={(props) => <Login {...props} applySession={this.applySession} />} />
          <PrivateRoute path='/home' component={Home} />
          {/* <PrivateRoute path='/home' render={(props) => <Home {...props} userProfile={userProfile} />} /> */}
        </div>
      </Router>
    )
  }
}
export default App