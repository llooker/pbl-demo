import _ from 'lodash'
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import AppContext from './contexts/AppContext';
import { checkForExistingSession, createSdkHelper, endSession } from '@pbl-demo/utils/auth';
import Home from './components/Home/Home';
import * as DemoComponentsContentArr from './config/Demo';
import { validIdHelper } from './tools';
import { SignIn } from '@pbl-demo/components';
import { SignInContent, initialUser } from './config';
import { packageNameTheme } from './config/theme.js';
import { ThemeProvider } from '@material-ui/core/styles';
import { errorHandler } from '@pbl-demo/utils'

function App(props) {

  const [clientSession, setClientSession] = useState({});
  const [sdk, setSdk] = useState();
  const [initialHref, setInitialHref] = useState();
  const [isReady, setIsReady] = useState(false);

  //onload
  useEffect(() => {
    async function fetchSession() {
      console.log("fetchSession")
      const { session, session: { userProfile, lookerBaseUrl, lookerApiToken } } = await checkForExistingSession();
      console.log({ session })
      console.log({ userProfile })
      console.log({ lookerBaseUrl })
      console.log({ lookerApiToken })
      //existing session only, i.e. < 60 minutes
      if (userProfile && lookerBaseUrl && lookerApiToken) {
        console.log("inside this ifff")
        const { status, sdk, err } = createSdkHelper({ accessToken: lookerApiToken.api_user_token, lookerBaseUrl })
        console.log({ status })
        console.log({ sdk })
        console.log({ err })
        if (status === "success") {
          setClientSession(session)
          //revalidate sdk
          setSdk(sdk)
          //add error handling for prod
          if (typeof errorHandler.setUser === 'function') {
            errorHandler.setUser(JSON.stringify(session.lookerUser))
          }
        } else if (status === "error") {
          setIsReady(false);
          endSession();
          setClientSession({})
          errorHandler.report(err)
        }
      } else console.log('else')
    }
    fetchSession(); //make async call
  }, [])

  useEffect(() => {
    console.log("useEffect clientSession, sdk")
    if (clientSession && sdk) { setIsReady(true) }
    else if (clientSession.userProfile) { //from signIn / write newSession
      const lookerBaseUrl = clientSession.lookerBaseUrl ? clientSession.lookerBaseUrl : '';
      const accessToken = clientSession.lookerApiToken ? clientSession.lookerApiToken.api_user_token : '';
      const { status, sdk, err } = createSdkHelper({ accessToken, lookerBaseUrl })

      console.log({ status })
      console.log({ sdk })
      console.log({ err })

      if (status === "success") {
        setSdk(sdk)
      } else if (status === "error") {
        setIsReady(false);
        endSession();
        setClientSession({})
        errorHandler.report(err)
      }
    } else console.log("else")
  }, [clientSession, sdk])


  console.log({ clientSession })


  return (
    < Router >
      <AppContext.Provider value={{
        clientSession, setClientSession,
        sdk, setSdk,
        initialHref, setInitialHref,
        isReady, setIsReady,
        theme: packageNameTheme,
      }}>
        <ThemeProvider theme={packageNameTheme}>
          <Switch>
            <PrivateRoute
              path='/analytics/:democomponent?'
              // exact
              isSignedIn={clientSession.userProfile ? true : false}
              component={Home}
              setInitialHref={setInitialHref}
              initialHref={initialHref}
            >
            </PrivateRoute>
            <PublicRoute
              path='/'
              exact
              isSignedIn={clientSession.userProfile ? true : false}
              component={SignIn}
              initialHref={initialHref}
              content={SignInContent}
              initialUser={initialUser}
            >
            </PublicRoute>
            {/* catach all route */}
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </ThemeProvider>
      </AppContext.Provider>
    </Router >
  )
}

App.propTypes = {

}

export default App

const PrivateRoute = ({
  component: Component,
  isSignedIn,
  setInitialHref,
  ...rest }) => {

  if (!isSignedIn) setInitialHref(window.location.href);
  else setInitialHref()

  return (

    <Route exact
      {...rest} render={(props) => (
        (isSignedIn) ?
          <Component {...props} />
          : <Redirect
            to="/"
          />
      )} />
  );
};


const PublicRoute = ({ component: Component,
  isSignedIn,
  // restricted, 
  initialHref,
  content,
  initialUser,
  ...rest }) => {

  const demoComponentMap = {};
  Object.keys(DemoComponentsContentArr).map(key => {
    demoComponentMap[validIdHelper(_.lowerCase(DemoComponentsContentArr[key].label))] =
      validIdHelper(_.startCase(DemoComponentsContentArr[key].type));
  });

  let urlToUse = '/analytics/home';
  if (initialHref) {
    let initialHrefArr = initialHref.split('/');
    let lastTwoHrefArr = initialHrefArr.slice(-2);
    let lastOneHrefArr = initialHrefArr.slice(-1);

    if (demoComponentMap.hasOwnProperty(lastOneHrefArr)) urlToUse = lastTwoHrefArr.join('/');
  }

  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route exact
      {...rest} render={(props) => (
        (isSignedIn) ?
          <Redirect
            to={urlToUse}
          />
          : <Component {...props}
            content={content}
            initialUser={initialUser} />
      )} />
  );
};