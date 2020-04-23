import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter, useHistory } from 'react-router-dom'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
// import Config from './clientConfig.json';
import Home from './components/Home'
// import Header from './components/Header'
// import Footer from './components/Footer'
import Customizations from './components/Customizations'
import EditCustomization from './components/EditCustomization'
import DefaultLookerContent from './lookerIndustriesByInstance.json';
//make looker user dynamic
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
    // console.log("this.props", this.props)
    const { from } = this.props.location.state || { from: { pathname: '/home' } } //needs work?
    const { pathname } = this.props.location
    const { activeCustomization } = this.props
    const { userProfile } = this.props

    const googleClientId = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}.apps.googleusercontent.com`
    if (Object.keys(userProfile).length) {
      return (
        <div className="App">
          {/* <Header
            onLogoutSuccess={this.props.applySession}
            companyName={activeCustomization.companyName || "WYSIWYG"} //default
            logoUrl={activeCustomization.logoUrl || "https://looker.com/assets/img/images/logos/looker_black.svg"} //default
            lookerUser={this.props.lookerUser}
            switchLookerUser={this.props.switchLookerUser}
            pathname={pathname}
          />
          <Redirect to={from} />
          <Footer pathname={pathname}
            lookerHost={this.props.lookerHost} /> */}
          <Redirect to={from} />
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

const PrivateRoute = ({
  component: Component,
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
  lookerUser,
  lookerHost,
  switchLookerUser, //added
  applySession, //added
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
          userProfile={userProfile}
          lookerUser={lookerUser}
          lookerHost={lookerHost}
          switchLookerUser={switchLookerUser} //added
          applySession={applySession} //added
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
      },
      lookerHost: '', //'demo.looker.com',
      // activeIndustry: 'marketing'
    }
  }

  componentDidMount() {
    console.log('App componentDidMount')
    this.checkSession()
  }

  //called on componentDidMount
  //get request so should only check info, never update
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
    // console.log('sessionResponseData', sessionResponseData)
    const { userProfile } = sessionResponseData.session
    const { customizations } = sessionResponseData.session
    const activeCustomization = sessionResponseData.session.activeCustomization ? sessionResponseData.session.activeCustomization : 0;
    const lookerUser = sessionResponseData.session.lookerUser ? sessionResponseData.session.lookerUser : this.state.lookerUser;
    const lookerHost = sessionResponseData.session.lookerHost ? sessionResponseData.session.lookerHost : this.state.lookerHost;

    //make sure defined and contains properties
    if (userProfile && Object.keys(userProfile).length) {
      this.setState((prevState) => ({
        userProfile, //think we want this here?
        customizations,
        lookerUser: {
          ...prevState.lookerUser,
          external_user_id: userProfile.googleId,
          first_name: userProfile.givenName,
          last_name: userProfile.familyName,
          permissions: LookerUserPermissions[lookerUser.permission_level] || LookerUserPermissions['good'], //assume good initially,
          permission_level: lookerUser.permission_level || 'good'
        },
        lookerHost
      }), () => {
        // console.log('checkSession callback 1111 this.state.lookerUser', this.state.lookerUser)
        this.applyCustomization(activeCustomization)
      })
    }
  }

  // called by responseGoogle once it gets response
  // since login can assume activeCustomization will be default..
  applySession = async (userProfile) => {
    console.log('applySession')
    console.log('userProfile', userProfile)

    if (Object.keys(userProfile).length === 0) {
      // console.log('inside ifff')
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
      const { customizations } = sessionResponseData.session
      const lookerUser = sessionResponseData.session.lookerUser ? sessionResponseData.session.lookerUser : this.state.lookerUser;
      const lookerHost = sessionResponseData.session.lookerHost ? sessionResponseData.session.lookerHost : this.state.lookerHost;

      this.setState(prevState => ({
        userProfile,
        customizations,
        lookerUser: {
          ...prevState.lookerUser,
          external_user_id: userProfile.googleId,
          first_name: userProfile.givenName,
          last_name: userProfile.familyName,
          permissions: LookerUserPermissions[lookerUser.permission_level] || LookerUserPermissions['good'], //assume good initially,
          permission_level: lookerUser.permission_level || 'good'
        },
        lookerHost
      }), () => {
        // console.log('applySession callback this.state.lookerUser', this.state.lookerUser)
        this.applyCustomization(0) //assume default customization, set lookerContent and activeCustomization in applyCustomization
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

    let lookerContentToUse = [];
    //check industry first, insert to array
    if (this.state.customizations[customizationIndex].industry) {
      lookerContentToUse = [...DefaultLookerContent[this.state.lookerHost][this.state.customizations[customizationIndex].industry]]
    }
    //then check custom content, insert to array
    if (this.state.customizations[customizationIndex].lookerContent) {
      lookerContentToUse = [...lookerContentToUse, ...this.state.customizations[customizationIndex].lookerContent]
    }

    this.setState({
      activeCustomization: this.state.customizations[customizationIndex],
      lookerContent: lookerContentToUse
    }, () => {
      // console.log('applyCustomization callback this.state.lookerContent', this.state.lookerContent)
      // console.log('applyCustomization callback this.state.activeCustomization', this.state.activeCustomization)
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

    // console.log('customizationResponseData', customizationResponseData)

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

    /*let customizationResponse = await fetch('/savelookercontent', {
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
    }))*/

  }

  switchLookerUser = (newUser) => {
    // console.log('switchLookerUser')
    // console.log('newUser', newUser)
    // console.log('LookerUserPermissions[newUser]', LookerUserPermissions[newUser])


    this.setState(prevState => ({
      lookerUser: {
        ...prevState.lookerUser,
        permissions: LookerUserPermissions[newUser],
        permission_level: newUser
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
      window.location.reload(); //reload to effect permissions

    });
  }





  render() {
    // console.log('App render');
    // console.log('this.props', this.props);
    const { userProfile } = this.state
    const { customizations } = this.state
    const { activeCustomization } = this.state
    const { indexOfCustomizationToEdit } = this.state
    const { lookerContent } = this.state
    const { lookerUser } = this.state;
    const { lookerHost } = this.state;
    const { activeUsecase } = this.state;
    // const { activeIndustry } = this.state;
    // console.log('activeCustomization', activeCustomization);
    // console.log('lookerUser', lookerUser);
    // console.log('lookerHost', lookerHost);
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
            lookerHost={lookerHost}
          />}
          />
          <PrivateRoute path='/home' component={Home}
            activeCustomization={activeCustomization}
            lookerContent={lookerContent}
            saveLookerContent={this.saveLookerContent}
            userProfile={userProfile}
            lookerUser={lookerUser}
            applySession={this.applySession}
            lookerHost={lookerHost}
            switchLookerUser={this.switchLookerUser}
          />
          <PrivateRoute exact path='/customize'
            component={Customizations}
            customizations={customizations}
            activeCustomization={activeCustomization}
            applyCustomization={this.applyCustomization}
            editCustomization={this.editCustomization}
            userProfile={userProfile}
            lookerHost={lookerHost}
          />
          <PrivateRoute path='/customize/edit' //index
            component={EditCustomization}
            customizations={customizations}
            indexOfCustomizationToEdit={indexOfCustomizationToEdit}
            saveCustomization={this.saveCustomization}
            cancelIndexOfCustomizationToEdit={this.cancelIndexOfCustomizationToEdit}
            userProfile={userProfile}
            lookerHost={lookerHost}
          />
        </div>
      </Router>
    )
  }
}
export default App

