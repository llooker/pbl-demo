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
import DefaultLookerContent from './defaultLookerContent.json';


import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
LookerEmbedSDK.init('demo.looker.com', '/auth')

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
      console.log('response.error', response.error)
    } else {
      auth.authenticated()
      this.props.applySession(response.profileObj)
    }
  }

  render() {
    // console.log("Login render")
    const { from } = this.props.location.state || { from: { pathname: '/home' } } //needs work?
    const { pathname } = this.props.location
    const googleClientId = `${Config.Google.clientId}.apps.googleusercontent.com`
    const { activeCustomization } = this.props

    if (auth.isAuthenticated === true) {
      return (
        <div className="App  ">
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
  // toggleModal, renderModal,
  customizations, activeCustomization, applyCustomization, editCustomization, indexOfCustomizationToEdit, saveCustomization, cancelIndexOfCustomizationToEdit, lookerContent, updateLookerContent, ...rest }) => (
    < Route {...rest} render={(props) => (
      auth.isAuthenticated === true ?
        <Component {...props}
          customizations={customizations}
          activeCustomization={activeCustomization}
          applyCustomization={applyCustomization}
          editCustomization={editCustomization}
          indexOfCustomizationToEdit={indexOfCustomizationToEdit}
          saveCustomization={saveCustomization}
          cancelIndexOfCustomizationToEdit={cancelIndexOfCustomizationToEdit}
          // renderModal={renderModal}
          // toggleModal={toggleModal}
          lookerContent={lookerContent}
          updateLookerContent={updateLookerContent}
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
      // renderModal: false,
      lookerContent: []
    }
  }

  componentDidMount() {
    // console.log('App componentDidMount')
    // console.log('this.props', this.props)
    // console.log('DefaultLookerContent', DefaultLookerContent)
    this.checkSession()
  }

  checkSession = async () => {
    // console.log('checkSession')
    let sessionResponse = await fetch('/readsession', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const sessionResponseData = await sessionResponse.json();
    const { userProfile } = sessionResponseData.session
    const { customizations } = sessionResponseData.session
    console.log('customizations', customizations)



    //make sure defined and contains properties
    if (userProfile && Object.keys(userProfile).length) {
      console.log('inside ifff')

      let lookerContentToUse = customizations[0].lookerContent ?
        [...DefaultLookerContent, ...customizations[0].lookerContent] :
        [...DefaultLookerContent]

      console.log('lookerContentToUse', lookerContentToUse)
      auth.authenticated(() => {
        this.setState({
          userProfile,
          customizations,
          activeCustomization: customizations[0],
          lookerContent: lookerContentToUse
        })
      })
    } else console.log('elllse')
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


    let lookerContentToUse = sessionResponseData.session.customizations[0].lookerContent ?
      [...DefaultLookerContent, ...sessionResponseData.session.customizations[0].lookerContent] :
      [...DefaultLookerContent]

    console.log('lookerContentToUse', lookerContentToUse)


    this.setState({
      userProfile,
      customizations: sessionResponseData.session.customizations,
      activeCustomization: sessionResponseData.session.customizations[0],
      lookerContent: lookerContentToUse
    }, () => {
      console.log('applySession callback this.state.lookerContent', this.state.lookerContent)
    });
  }

  applyCustomization = (customizationIndex) => {
    console.log('applyCustomization')
    console.log('customizationIndex', customizationIndex)
    let lookerContentToUse = this.state.customizations[customizationIndex].lookerContent ?
      [...DefaultLookerContent, ...this.state.customizations[customizationIndex].lookerContent] :
      [...DefaultLookerContent]

    console.log('lookerContentToUse', lookerContentToUse)

    this.setState({
      activeCustomization: this.state.customizations[customizationIndex],
      lookerContent: lookerContentToUse
    });
  }

  editCustomization = (customizationIndex) => {
    // console.log('editCustomization')
    // console.log('customizationIndex', customizationIndex)
    const validCustomizationIndex = typeof this.state.customizations[customizationIndex] === 'undefined' ? null : customizationIndex
    this.setState({
      indexOfCustomizationToEdit: validCustomizationIndex,
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
    const { indexOfCustomizationToEdit } = this.state

    let lookerContentToUse = this.state.customizations[indexOfCustomizationToEdit].lookerContent ?
      [...DefaultLookerContent, ...this.state.customizations[indexOfCustomizationToEdit].lookerContent] :
      [...DefaultLookerContent]

    this.setState({
      customizations: customizationResponseData.customizations,
      activeCustomization: indexOfCustomizationToEdit ? customizationResponseData.customizations[indexOfCustomizationToEdit]
        : customizationResponseData.customizations[customizationResponseData.customizations.length - 1],
      indexOfCustomizationToEdit: null,
      lookerContent: lookerContentToUse
    });
  }


  cancelIndexOfCustomizationToEdit = () => {
    // console.log("cancelIndexOfCustomizationToEdit")
    this.setState({
      indexOfCustomizationToEdit: null
    })
  }

  updateLookerContent = async (newLookerContent) => {
    console.log('updateLookerContent')
    console.log('newLookerContent', newLookerContent)
    console.log('this.state.activeCustomization', this.state.activeCustomization)

    let objToUse = {
      type: newLookerContent.type.value,
      id: newLookerContent.id.value,
      name: newLookerContent.name.value
    }

    let customizationResponse = await fetch('/savelookercontent', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ activeCustomization: this.state.activeCustomization, newLookerContent: objToUse })
    })
    let customizationResponseData = await customizationResponse.json();
    console.log('customizationResponseData', customizationResponseData)

    this.setState(prevState => ({
      lookerContent: [...prevState.lookerContent, objToUse],
      // renderModal: false
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
    console.log('lookerContent', lookerContent)
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
            updateLookerContent={this.updateLookerContent}
          />

          <PrivateRoute exact path='/customize'
            component={Customizations}
            customizations={customizations}
            activeCustomization={activeCustomization}
            applyCustomization={this.applyCustomization}
            editCustomization={this.editCustomization}
          />
          <PrivateRoute path='/customize/edit' //index
            component={EditCustomization}
            customizations={customizations}
            indexOfCustomizationToEdit={indexOfCustomizationToEdit}
            saveCustomization={this.saveCustomization}
            cancelIndexOfCustomizationToEdit={this.cancelIndexOfCustomizationToEdit}
          />
        </div>
      </Router>
    )
  }
}
export default App