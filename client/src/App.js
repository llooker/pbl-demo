import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import Config from './config.json';
import Navbar from './components/Navbar'
import Footer from './components/Footer'
// import Sidebar from './components/Sidebar'
import Home from './components/Home'
import Lookup from './components/Lookup'
import Report from './components/Report'
import Explore from './components/Explore'
import Customize from './components/Customize'

console.log('Config', Config)


//to discuss with wes -- how can I eliminate this?
//is this something I wanna replace with passport?
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
    console.log('Login render');
    const { from } = this.props.location.state || { from: { pathname: '/home' } } //needs work?
    const { pathname } = this.props.location
    const googleClientId = `${Config.Google.clientId}.apps.googleusercontent.com`

    console.log('from', from);
    // const { userProfile } = this.props
    // if (Object.keys(userProfile).length) {
    if (auth.isAuthenticated === true) {
      return (
        <div className="App fade ">
          <Navbar
            clientId={googleClientId}
            buttonText="Logout"
            onLogoutSuccess={this.props.applySession} />

          {/* <div className="row pt-3"> */}
          {/* <Sidebar pathname={pathname} /> */}
          <Redirect to={from} />
          {/* </div> */}

          <Footer location={this.props.location} />
        </div>
      )
    } else {
      return (
        <div className="App fade">
          <h1>You need to login</h1>
          <GoogleLogin
            clientId={googleClientId}
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
      pathname: '/',
      state: { from: props.location }
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
    // console.log('App componentDidMount')
    this.checkForSession()
  }

  checkForSession = async () => {
    // console.log('checkForSession')
    let sessionResponse = await fetch('/session', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    let sessionResponseData = await sessionResponse.json();
    const { userProfile } = sessionResponseData.session
    //make sure defined and contains properties
    if (userProfile && Object.keys(userProfile).length) {
      auth.authenticated(() => {
        this.setState({
          userProfile
        }, () => {
          // console.log('checkForSession callback')
          // console.log('this.state.userProfile', this.state.userProfile)

        })
      })
    } //else { console.log('else') }
  }

  applySession = (userProfile) => {
    // console.log('applySession')
    // console.log('userProfile', userProfile)
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
          // console.log('applySession callback')
          // console.log('this.state.userProfile', this.state.userProfile)
        });
      }
    });
  }

  render() {
    // console.log('App render');
    const { userProfile } = this.state
    return (
      <Router>
        <div>
          <Route extact path='/' render={(props) => <Login {...props} applySession={this.applySession} userProfile={userProfile} />} />
          <PrivateRoute path='/home' component={Home} />
          <PrivateRoute path='/lookup' component={Lookup} />
          <PrivateRoute path='/report' component={Report} />
          <PrivateRoute path='/explore' component={Explore} />
          <PrivateRoute path='/customize' component={Customize} />
        </div>
      </Router>
    )
  }
}
export default App