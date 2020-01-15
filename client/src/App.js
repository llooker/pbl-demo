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
    console.log('Login render');
    const { from } = this.props.location.state || { from: { pathname: '/home' } } //needs work?
    const { pathname } = this.props.location
    const googleClientId = `${Config.Google.clientId}.apps.googleusercontent.com`
    const { activeCustomization } = this.props
    console.log('activeCustomization', activeCustomization);

    // console.log('from', from);
    // const { userProfile } = this.props
    // if (Object.keys(userProfile).length) {
    if (auth.isAuthenticated === true) {
      return (
        <div className="App fade ">
          <Navbar
            clientId={googleClientId}
            buttonText="Logout"
            onLogoutSuccess={this.props.applySession}
            companyname={activeCustomization.companyname || "Company name"}
          />

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
      activeCustomization: {}
    }
  }

  componentDidMount() {
    // console.log('App componentDidMount')
    // this.checkForSession()
    this.checkForUserData()
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

  checkForUserData = async () => {
    console.log('checkForUserData')
    let userData = await fetch('/userdata', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    let userDataResponse = await userData.json();
    console.log('userDataResponse', userDataResponse)
    const { userProfile } = userDataResponse.session
    //make sure defined and contains properties
    // if (userProfile && Object.keys(userProfile).length) {
    //   auth.authenticated(() => {
    //     this.setState({
    //       userProfile
    //     }, () => {
    //       // console.log('checkForSession callback')
    //       // console.log('this.state.userProfile', this.state.userProfile)

    //     })
    //   })
    // } //else { console.log('else') }
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
    let sessionDataResponse = await sessionData.json();
    console.log('sessionDataResponse', sessionDataResponse)
    if (Object.keys(userProfile).length === 0) {
      auth.signout()
    }
    this.setState({
      userProfile,
      customizations: sessionDataResponse.session.customizations
    }, () => {
      console.log('applySession callback')
      console.log('this.state.userProfile', this.state.userProfile)
      console.log('this.state.customizations', this.state.customizations)
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
    return (
      <Router>
        <div>
          <Route extact path='/' render={(props) => <Login
            {...props}
            applySession={this.applySession}
            userProfile={userProfile}
            activeCustomization={this.state.activeCustomization} />}
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