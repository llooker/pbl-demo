import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter, useHistory } from 'react-router-dom'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import Config from './clientConfig.json';
import Header from './components/Header'
import Footer from './components/Footer'
import Content from './components/Content'
import Customizations from './components/Customizations'
import EditCustomization from './components/EditCustomization'
// import DefaultLookerContent from './defaultLookerContent.json';
import DefaultLookerContent from './defaultLookerContentIndustry.json';


class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  responseGoogle = (response) => {
    // debugger
    if (response.error) {
      console.log('response.error', response.error)
    } else {
      this.props.applySession(response.profileObj)
    }
  }

  render() {
    // console.log("Login render")
    // console.log('this.props.userProfile', this.props.userProfile)
    const { from } = this.props.location.state || { from: { pathname: '/home' } } //needs work?
    const { pathname } = this.props.location
    const googleClientId = `${Config.Google.clientId}.apps.googleusercontent.com`
    const { activeCustomization } = this.props
    const { userProfile } = this.props

    if (Object.keys(userProfile).length) {
      return (
        <div className="App">
          <Header
            clientId={googleClientId}
            buttonText="Logout"
            onLogoutSuccess={this.props.applySession}
            companyName={activeCustomization.companyName || "WYSIWYG"} //default
            logoUrl={activeCustomization.logoUrl || "https://looker.com/assets/img/images/logos/looker_black.svg"} //default
          />
          <Redirect to={from} />
          <Footer pathname={pathname} />
        </div>
      )
    } else {
      return (
        <div className="App h-100">
          <div className="home container p-5 position-relative h-100">
            <div className="row pt-3 h-25"></div>
            <div className="row pt-3 h-50">
              <div className="col-sm-4">
              </div>
              <div className="col-sm-4 bg-light h-100 v-center border rounded p-5">
                <div>
                  <h2>PBL App</h2>
                  <p>Login with Google to get started</p>
                </div>
                <div className="pt-1">
                  <GoogleLogin
                    clientId={googleClientId}
                    buttonText="Login"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                    cookiePolicy={'single_host_origin'}
                  /></div>
              </div>
            </div>
          </div>
        </div >
      )
    }
  }
}

const PrivateRoute = ({ component: Component,
  customizations,
  activeCustomization,
  applyCustomization,
  editCustomization,
  indexOfCustomizationToEdit,
  saveCustomization,
  cancelIndexOfCustomizationToEdit,
  lookerContent,
  saveLookerContent,
  userProfile,
  ...rest }) => (
    < Route {...rest} render={(props) => (
      Object.keys(userProfile).length ?
        <Component {...props}
          customizations={customizations}
          activeCustomization={activeCustomization}
          applyCustomization={applyCustomization}
          editCustomization={editCustomization}
          indexOfCustomizationToEdit={indexOfCustomizationToEdit}
          saveCustomization={saveCustomization}
          cancelIndexOfCustomizationToEdit={cancelIndexOfCustomizationToEdit}
          lookerContent={lookerContent}
          saveLookerContent={saveLookerContent}
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
      customizations: [],
      activeCustomization: {},
      indexOfCustomizationToEdit: null,
      lookerContent: []
    }
  }

  componentDidMount() {
    console.log('App componentDidMount')
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
    const sessionResponseData = await sessionResponse.json();
    console.log('sessionResponseData', sessionResponseData)
    const { userProfile } = sessionResponseData.session
    const { customizations } = sessionResponseData.session

    //make sure defined and contains properties
    if (userProfile && Object.keys(userProfile).length) {

      //here's my problem, always assume first customization...
      let lookerContentToUse = customizations[0].lookerContent ?
        [...DefaultLookerContent[customizations[0].industry], ...customizations[0].lookerContent] :
        [...DefaultLookerContent[customizations[0].industry]]
      //auth.authenticated(() => {
      this.setState({
        userProfile,
        customizations,
        activeCustomization: customizations[0],
        lookerContent: lookerContentToUse
      }, () => {
        // console.log('checkSession callback this.state.customizations', this.state.customizations)
        // console.log('checkSession callback this.state.lookerContent', this.state.lookerContent)
      })
      //})
    }
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
    const sessionResponseData = await sessionData.json();
    if (Object.keys(userProfile).length === 0) {
      this.setState({
        userProfile: {} //for now
      })
    }
    console.log('sessionResponseData', sessionResponseData)
    const { customizations } = sessionResponseData.session


    let lookerContentToUse = customizations[0].lookerContent ?
      [...DefaultLookerContent[customizations[0].industry], ...customizations[0].lookerContent] :
      [...DefaultLookerContent[customizations[0].industry]]

    this.setState({
      userProfile,
      customizations: sessionResponseData.session.customizations,
      activeCustomization: sessionResponseData.session.customizations[0],
      lookerContent: lookerContentToUse
    }, () => {
      // console.log('applySession callback this.state.lookerContent', this.state.lookerContent)
    });
  }

  applyCustomization = async (customizationIndex) => {
    console.log('applyCustomization')
    console.log('customizationIndex', customizationIndex)

    let lookerContentToUse = this.state.customizations[customizationIndex].lookerContent ?
      [...DefaultLookerContent[this.state.customizations[customizationIndex].industry], ...this.state.customizations[customizationIndex].lookerContent] :
      [...DefaultLookerContent[this.state.customizations[customizationIndex].industry]]
    console.log('lookerContentToUse', lookerContentToUse)

    this.setState({
      activeCustomization: this.state.customizations[customizationIndex],
      lookerContent: lookerContentToUse
    }, () => {
      // console.log('applyCustomization callback this.state.lookerContent', this.state.lookerContent)
    });
  }

  editCustomization = (customizationIndex) => {
    // console.log('editCustomization')
    // console.log('customizationIndex', customizationIndex)
    const validCustomizationIndex = typeof this.state.customizations[customizationIndex] === 'undefined' ? null : customizationIndex
    this.setState({
      indexOfCustomizationToEdit: validCustomizationIndex,
    }, () => {
      // console.log('editCustomization callback this.state.indexOfCustomizationToEdit', this.state.indexOfCustomizationToEdit)
    });
  }

  saveCustomization = async (formData) => {
    // console.log('saveCustomization')
    // console.log('formData', formData)
    let customizationResponse = await fetch('/savecustomization', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    let customizationResponseData = await customizationResponse.json();
    const { activeCustomization } = customizationResponseData
    this.setState({
      customizations: customizationResponseData.customizations,
      indexOfCustomizationToEdit: null
    }, () => {
      this.applyCustomization(activeCustomization)
    })
  }


  cancelIndexOfCustomizationToEdit = () => {
    // console.log("cancelIndexOfCustomizationToEdit")
    this.setState({
      indexOfCustomizationToEdit: null
    })
  }

  saveLookerContent = async (newLookerContent) => {
    // console.log('saveLookerContent')
    // console.log('newLookerContent', newLookerContent)

    let customizationResponse = await fetch('/savelookercontent', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ activeCustomization: this.state.activeCustomization, newLookerContent: newLookerContent })
    })
    let customizationResponseData = await customizationResponse.json();

    this.setState(prevState => ({
      lookerContent: [...prevState.lookerContent, newLookerContent] //should I be using DB as source here?
    }))

  }


  render() {
    console.log('App render');
    // console.log('this.props', this.props);
    const { userProfile } = this.state
    const { customizations } = this.state
    const { activeCustomization } = this.state
    const { indexOfCustomizationToEdit } = this.state
    const { lookerContent } = this.state
    // console.log('userProfile', userProfile)
    console.log('activeCustomization', activeCustomization)
    return (
      <Router>
        <div>
          <Route extact path='/' render={(props) => <Login
            {...props}
            applySession={this.applySession}
            userProfile={userProfile}
            activeCustomization={activeCustomization}
          />}
          />
          <PrivateRoute path='/home' component={Content}
            activeCustomization={activeCustomization}
            lookerContent={lookerContent}
            saveLookerContent={this.saveLookerContent}
            userProfile={userProfile}
          />
          <PrivateRoute exact path='/customize'
            component={Customizations}
            customizations={customizations}
            activeCustomization={activeCustomization}
            applyCustomization={this.applyCustomization}
            editCustomization={this.editCustomization}
            userProfile={userProfile}
          />
          <PrivateRoute path='/customize/edit' //index
            component={EditCustomization}
            customizations={customizations}
            indexOfCustomizationToEdit={indexOfCustomizationToEdit}
            saveCustomization={this.saveCustomization}
            cancelIndexOfCustomizationToEdit={this.cancelIndexOfCustomizationToEdit}
            userProfile={userProfile}
          />
        </div>
      </Router>
    )
  }
}
export default App