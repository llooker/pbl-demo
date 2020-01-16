import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import Config from './clientConfig.json';
import Navbar from './components/Navbar'
import Footer from './components/Footer'
// import Sidebar from './components/Sidebar'
import Home from './components/Home'
import Lookup from './components/Lookup'
import Report from './components/Report'
import Explore from './components/Explore'
import Customize from './components/Customize'



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
    const { from } = this.props.location.state || { from: { pathname: '/home' } } //needs work?
    const { pathname } = this.props.location
    const googleClientId = `${Config.Google.clientId}.apps.googleusercontent.com`
    const { activeCustomization } = this.props

    if (auth.isAuthenticated === true) {
      return (
        <div className="App fade ">
          <Navbar
            clientId={googleClientId}
            buttonText="Logout"
            onLogoutSuccess={this.props.applySession}
            companyname={activeCustomization.companyname || "WYSIWYG"} //default
          />
          <Redirect to={from} />
          <Footer pathname={pathname} />
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

// const PrivateRoute = ({ component: Component, additionalMethod, ...rest }) => (
const PrivateRoute = ({ component: Component, ...rest }) => (
  < Route {...rest} render={(props) => (
    // auth.isAuthenticated === true ? <Component {...props} additionalMethod={additionalMethod} /> : <Redirect to={{
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
      userProfile: {},
      customizations: [],
    }
  }

  componentDidMount() {
    // console.log('App componentDidMount')
    this.checkSession()
  }

  checkSession = async () => {
    console.log('checkSession')
    let sessionResponse = await fetch('/readsession', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    let sessionResponseData = await sessionResponse.json();
    const { userProfile } = sessionResponseData.session
    const { customizations } = sessionResponseData.session
    //make sure defined and contains properties
    if (userProfile && Object.keys(userProfile).length) {
      auth.authenticated(() => {
        this.setState({
          userProfile,
          customizations
        }, () => {
          console.log('checkSession callback')
          console.log('this.state.userProfile', this.state.userProfile)
          console.log('this.state.customizations', this.state.customizations)

        })
      })
    } else console.log('ellse')
  }


  applySession = async (userProfile) => {
    console.log('applySession')
    console.log('userProfile', userProfile)
    let sessionData = await fetch('/writesession', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userProfile)
    })
    let sessionResponseData = await sessionData.json();
    if (Object.keys(userProfile).length === 0) {
      auth.signout()
    }
    this.setState({
      userProfile,
      customizations: sessionResponseData.session.customizations,
      // activeCustomization: sessionResponseData.session.customizations[0]
    }, () => {
      console.log('applySession callback')
      console.log('this.state.userProfile', this.state.userProfile)
      console.log('this.state.customizations', this.state.customizations)
      // console.log('this.state.activeCustomization', this.state.activeCustomization)
    });
  }

  applyCustomization = (customization) => {
    console.log('applyCustomization')
    console.log('customization', customization)
    this.setState({ activeCustomization: customization })
  }

  render() {
    // console.log('App render');
    const { userProfile } = this.state
    const activeCustomization = this.state.customizations[0]
    return (
      <Router>
        <div>
          <Route extact path='/' render={(props) => <Login
            {...props}
            applySession={this.applySession}
            userProfile={userProfile}
            activeCustomization={activeCustomization} />}
          />
          <PrivateRoute path='/home' component={Home} />
          <PrivateRoute path='/lookup' component={Lookup} />
          <PrivateRoute path='/report' component={Report} />
          <PrivateRoute path='/explore' component={Explore} />
          <PrivateRoute path='/customize' component={Customize} />
          {/* <PrivateRoute path='/customize' component={Customize} additionalMethod={this.applyCustomization} /> */}
        </div>
      </Router>
    )
  }
}
export default App