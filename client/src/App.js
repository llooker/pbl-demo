import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom'
import { GoogleLogin } from 'react-google-login';
import { GoogleLogout } from 'react-google-login';
import Home from './components/Home'


//unncessary
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

// const Home = () => <h3>Home</h3>
// const Protected = () => <h3>Protected</h3>

class Login extends React.Component {
  state = {
    redirectToRefer: false,
  }

  responseGoogle = (response) => {
    if (response.error) {
    } else {
      auth.authenticated(() => {
        this.setState(() => ({
          redirectToRefer: true
        }))
      })
    }
  }

  render() {
    const { redirectToRefer } = this.state
    const { from } = this.props.location.state || { from: { pathname: '/home' } }
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
  <Route {...rest} render={(props) => (
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
  render() {
    console.log('App render')
    return (
      <Router>
        <div>
          <AuthStatus />
          <Route exact path='/' component={Login} />
          <PrivateRoute path='/home' component={Home} />
        </div>
      </Router>
    )
  }
}
export default App