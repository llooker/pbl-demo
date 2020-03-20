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
import DefaultLookerContent from './defaultLookerContentIndustry.json';
//make looker user
import LookerUserPermissions from './lookerUserPermissions.json';
import InitialLookerUser from './initialLookerUser.json';

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
    // console.log("Login render")
    const { from } = this.props.location.state || { from: { pathname: '/home' } } //needs work?
    const { pathname } = this.props.location
    const { activeCustomization } = this.props
    const { userProfile } = this.props

    const googleClientId = `${Config.Google.clientId}.apps.googleusercontent.com`

    if (Object.keys(userProfile).length) {
      return (
        <div className="App">
          <Header
            clientId={googleClientId}
            buttonText="Logout"
            onLogoutSuccess={this.props.applySession}
            companyName={activeCustomization.companyName || "WYSIWYG"} //default
            logoUrl={activeCustomization.logoUrl || "https://looker.com/assets/img/images/logos/looker_black.svg"} //default
            lookerUser={this.props.lookerUser}
            switchLookerUser={this.props.switchLookerUser}
            pathname={pathname}
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
      lookerContent: [],
      lookerUser: {
        ...InitialLookerUser
      }
    }
  }

  componentDidMount() {
    // console.log('App componentDidMount')
    this.checkSession()
  }

  //called on componentDidMount
  //get request so should only check info, never update
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
    const { activeCustomization } = sessionResponseData.session || 0;

    //make sure defined and contains properties
    if (userProfile && Object.keys(userProfile).length) {
      this.setState(prevState => ({
        userProfile,
        customizations,
        lookerUser: {
          ...prevState.lookerUser,
          external_user_id: userProfile.googleId,
          first_name: userProfile.givenName,
          last_name: userProfile.familyName,
          permissions: LookerUserPermissions['good'], //assume good initially,
          permissionLevel: 'good'
        }
      }), () => {
        this.applyCustomization(activeCustomization)
      })
    }
  }

  // called by responseGoogle once it gets response
  // since login can assume activeCustomization will be default..
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
        userProfile: {} //for now
      })
    } else {
      let sessionData = await fetch('/writesession', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userProfile)
      })
      const sessionResponseData = await sessionData.json();
      console.log('sessionResponseData', sessionResponseData)
      const { customizations } = sessionResponseData.session

      this.setState(prevState => ({
        userProfile,
        customizations,
        lookerUser: {
          ...prevState.lookerUser,
          external_user_id: userProfile.googleId,
          first_name: userProfile.givenName,
          last_name: userProfile.familyName,
          permissions: LookerUserPermissions['good'], //assume good initially,
          permissionLevel: 'good'
        }
      }), () => {
        this.applyCustomization(0) //assume default customization, set lookerContent and activeCustomization in applyCustomization
        console.log('this.state.lookerUser', this.state.lookerUser)
      });
    }
  }

  //called by: checkSession, applySession, applyButton, saveCustomization
  applyCustomization = async (customizationIndex) => {
    // console.log('applyCustomization')
    // console.log('customizationIndex', customizationIndex)

    let customizationResponse = await fetch('/applyactivecustomziation', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ customizationIndex })
    })

    let customizationResponseData = await customizationResponse.json();

    let lookerContentToUse = this.state.customizations[customizationIndex].lookerContent ?
      [...DefaultLookerContent[this.state.customizations[customizationIndex].industry], ...this.state.customizations[customizationIndex].lookerContent] :
      [...DefaultLookerContent[this.state.customizations[customizationIndex].industry]]

    this.setState({
      activeCustomization: this.state.customizations[customizationIndex],
      lookerContent: lookerContentToUse
    }, () => {
      // console.log('applyCustomization callback this.state.lookerContent', this.state.lookerContent)
      // this.props.history.push('/home') //not going to work here :P
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

    this.setState({
      customizations: customizationResponseData.customizations,
      // indexOfCustomizationToEdit: null
    }, () => {
      this.applyCustomization(formData.customizationIndex) //sessionActiveCustomization
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

  switchLookerUser = (newUser) => {
    // console.log('switchLookerUser')
    // console.log('newUser', newUser)
    // console.log('LookerUserPermissions[newUser]', LookerUserPermissions[newUser])

    this.setState(prevState => ({
      lookerUser: {
        ...prevState.lookerUser,
        permissions: LookerUserPermissions[newUser],
        permissionLevel: newUser
      }
    }), () => {
      // console.log('this.state.lookerUser', this.state.lookerUser)
    });
  }

  render() {
    console.log('App render');
    console.log('this.props', this.props);
    const { userProfile } = this.state
    const { customizations } = this.state
    const { activeCustomization } = this.state
    const { indexOfCustomizationToEdit } = this.state
    const { lookerContent } = this.state
    const { lookerUser } = this.state;
    // console.log('activeCustomization', activeCustomization);
    // console.log('lookerUser', lookerUser);
    return (
      <Router>
        <div>
          <Route extact path='/' render={(props) => <Login
            {...props}
            applySession={this.applySession}
            userProfile={userProfile}
            activeCustomization={activeCustomization}
            lookerUser={lookerUser}
            switchLookerUser={this.switchLookerUser}
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

