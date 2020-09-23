import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter, useHistory } from 'react-router-dom'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
// import Config from './clientConfig.json';
import Home from './components/Home'
import SignIn from './components/SignIn'
// import Header from './components/Header'
// import Footer from './components/Footer'
import Customizations from './components/Customizations'
import EditCustomization from './components/EditCustomization'
//make looker user dynamic
import LookerUserPermissions from './lookerUserPermissions.json';
import InitialLookerUser from './initialLookerUser.json';
import UsecaseContent from './usecaseContent.json';
import LookerUserAttributeBrandOptions from './lookerUserAttributeBrandOptions.json';

export const lookerUserTimeHorizonMap = {
  'basic': 'last 182 days',
  'advanced': 'last 365 days',
  'premium': 'last 730 days' //before today
}

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

    const { from } = this.props.location.state || { from: { pathname: '/analytics' } } //needs work?
    const { pathname } = this.props.location
    const { activeCustomization } = this.props
    const { userProfile } = this.props

    const googleClientId = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}.apps.googleusercontent.com`
    if (Object.keys(userProfile).length) {
      return (
        <div className="App">
          <Redirect to={from} />
        </div>
      )
    } else {
      return (
        <SignIn
          googleClientId={googleClientId}
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          usecaseFromUrl={usecaseHelper()}
        />
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
  switchLookerUser,
  applySession,
  lookerUserAttributeBrandOptions,
  switchUserAttributeBrand,
  usecaseFromUrl,
  accessToken,
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
          switchLookerUser={switchLookerUser}
          applySession={applySession}
          lookerUserAttributeBrandOptions={lookerUserAttributeBrandOptions}
          switchUserAttributeBrand={switchUserAttributeBrand}
          usecaseFromUrl={usecaseFromUrl}
          accessToken={accessToken}
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
      // lookerContent: [UsecaseContent[activeUsecase]],
      lookerUser: {
        ...InitialLookerUser
      },
      lookerHost: '',
      activeUsecase: '',
      tokenLastRefreshed: '',
      accessToken: ''
    }
  }

  // keep track of when user logs in
  // keep track of current time 
  // if current time > initial log in time plus buffer, logout
  logoutTimer = () => {
    let clientInterval = setInterval(async () => {
      let currentTime = Date.now();
      let expiresInBuffer = 58 * 60 * 1000; //3480000; //58 minutes
      if (currentTime > (this.state.tokenLastRefreshed + expiresInBuffer)) {
        this.applySession({})
        clearInterval(clientInterval);
      }
    }, 1000)
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
    // console.log('sessionResponseData', sessionResponseData)
    const { userProfile } = sessionResponseData.session
    const { customizations } = sessionResponseData.session
    const activeCustomization = sessionResponseData.session.activeCustomization ? sessionResponseData.session.activeCustomization : 0;
    const lookerUser = sessionResponseData.session.lookerUser ? sessionResponseData.session.lookerUser : this.state.lookerUser;
    const lookerHost = sessionResponseData.session.lookerHost ? sessionResponseData.session.lookerHost : this.state.lookerHost;
    // console.log('lookerUser', lookerUser)
    //make sure defined and contains properties
    if (userProfile && Object.keys(userProfile).length) {
      this.setState((prevState) => ({
        userProfile, //think we want this here?
        customizations,
        lookerUser: {
          ...prevState.lookerUser,
          external_user_id: userProfile.email, //googleId
          first_name: userProfile.givenName,
          last_name: userProfile.familyName,
          permissions: LookerUserPermissions[lookerUser.user_attributes.permission_level] || LookerUserPermissions['basic'],
          user_attributes: {
            ...lookerUser.user_attributes || {
              "locale": "en_US",
              "country": "USA",
              "brand": "Calvin Klein",
              "permission_level": "basic"
            }
          }
        },
        lookerHost,
        tokenLastRefreshed: sessionResponseData.session.mongoInfo.api_token_last_refreshed || Date.now(),
        accessToken: sessionResponseData.session.mongoInfo.api_user_token || ''
      }), () => {
        // console.log('checkSession callback 1111 this.state.lookerUser', this.state.lookerUser)
        this.applyCustomization(activeCustomization)
        this.logoutTimer()
      })
    }
  }

  // called by responseGoogle once it gets response
  // since login can assume activeCustomization will be default..
  applySession = async (userProfile) => {
    // console.log('applySession')
    // console.log('userProfile', userProfile)

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
        userProfile: {},
        lookerUser: { ...InitialLookerUser }
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
          external_user_id: userProfile.email, //googleId
          first_name: userProfile.givenName,
          last_name: userProfile.familyName,
          permissions: LookerUserPermissions[lookerUser.user_attributes.permission_level] || LookerUserPermissions['basic'], //assume good initially,
          user_attributes: {
            ...lookerUser.user_attributes || {
              "locale": "en_US",
              "country": "USA",
              "brand": "Calvin Klein",
              "time_horizon": "last 6 months",
              "permission_level": "basic",
            }
          }
        },
        lookerHost,
        tokenLastRefreshed: sessionResponseData.session.mongoInfo.api_token_last_refreshed || Date.now(),
        accessToken: sessionResponseData.session.mongoInfo.api_user_token || ''
      }), () => {
        this.applyCustomization(0) //assume default customization, set lookerContent and activeCustomization in applyCustomization
        this.logoutTimer()
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
      // lookerContentToUse = [...DefaultLookerContent[this.state.lookerHost][this.state.customizations[customizationIndex].industry]]
    }
    //then check custom content, insert to array
    if (this.state.customizations[customizationIndex].lookerContent) {
      // lookerContentToUse = [...lookerContentToUse, ...this.state.customizations[customizationIndex].lookerContent]
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


    let userAttributeCopy = { ...this.state.lookerUser.user_attributes, "permission_level": newUser }
    userAttributeCopy.time_horizon = lookerUserTimeHorizonMap[newUser];


    this.setState(prevState => ({
      lookerUser: {
        ...prevState.lookerUser,
        permissions: LookerUserPermissions[newUser],
        user_attributes: userAttributeCopy
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

    });
  }

  switchUserAttributeBrand = (newAttribute) => {
    // console.log('switchUserAttributeBrand')
    // console.log('newAttribute', newAttribute)

    let userAttributeCopy = { ...this.state.lookerUser.user_attributes }
    userAttributeCopy.brand = newAttribute;

    let usecaseFromUrl = usecaseHelper();

    this.setState(prevState => ({
      lookerUser: {
        ...prevState.lookerUser,
        user_attributes: userAttributeCopy,
        group_ids: [UsecaseContent[usecaseFromUrl].groupIds[newAttribute.replace("'", "")]] //needed to replace apostrophe
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

    });
  }

  render() {
    // console.log('App render');
    // console.log('this.props', this.props);
    const { userProfile, customizations, activeCustomization, indexOfCustomizationToEdit, lookerContent, lookerUser, lookerHost, accessToken } = this.state;
    // console.log('accessToken', accessToken)
    // const { activeIndustry } = this.state;
    // console.log('activeCustomization', activeCustomization);

    let usecaseFromUrl = usecaseHelper();

    return (
      <Router>
        <div>
          <Route path='' render={(props) => <Login
            {...props}
            applySession={this.applySession}
            userProfile={userProfile}
            activeCustomization={activeCustomization}
            lookerUser={lookerUser}
            switchLookerUser={this.switchLookerUser}
            lookerHost={lookerHost}
          />}
          />
          <PrivateRoute path='/analytics' component={Home}
            activeCustomization={activeCustomization}
            lookerContent={lookerContent}
            saveLookerContent={this.saveLookerContent}
            userProfile={userProfile}
            lookerUser={lookerUser}
            applySession={this.applySession}
            lookerHost={lookerHost}
            switchLookerUser={this.switchLookerUser}
            lookerUserAttributeBrandOptions={LookerUserAttributeBrandOptions}
            switchUserAttributeBrand={this.switchUserAttributeBrand}
            usecaseFromUrl={usecaseFromUrl}
            accessToken={accessToken}
          />
        </div>
      </Router>
    )
  }
}
export default App

export function usecaseHelper() {
  let keyArr = Object.keys(UsecaseContent);
  let url = window.location.href;
  for (let i = 0; i < keyArr.length; i++) {
    if (url.indexOf(keyArr[i]) > -1) {
      return keyArr[i];
    }
  }
  return 'atom';
}

