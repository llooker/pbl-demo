import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Switch, Route, Redirect, useParams } from "react-router-dom";
import AppContext from './contexts/AppContext';
import { checkForExistingSession, createSdkHelper } from './AuthUtils/auth';
import SignIn from './components/SignIn/SignIn';
import Home from './components/Home/Home';


function App(props) {

  const [clientSession, setClientSession] = useState({});
  const [sdk, setSdk] = useState();
  const [initialHref, setInitialHref] = useState();
  const [isReady, setIsReady] = useState(false);

  //onload
  useEffect(() => {
    async function fetchSession() {

      const sessionResponse = await checkForExistingSession();
      // console.log({ sessionResponse })
      if (sessionResponse.session && sessionResponse.session.userProfile) {

        const lookerHost = sessionResponse.session.lookerHost ? sessionResponse.session.lookerHost : '';
        const accessToken = sessionResponse.session.lookerApiToken ? sessionResponse.session.lookerApiToken.api_user_token : '';
        const sdk = createSdkHelper({ lookerHost, accessToken })
        // console.log({ sdk })
        setClientSession(sessionResponse.session)
        setSdk(sdk)
      }
    }
    fetchSession(); //make async call
  }, [])

  useEffect(() => {
    // console.log({ clientSession })
    // console.log({ sdk })
    if (clientSession && sdk) setIsReady(true)
    else if (clientSession.userProfile) {
      const lookerHost = clientSession.lookerHost ? clientSession.lookerHost : '';
      const accessToken = clientSession.lookerApiToken ? clientSession.lookerApiToken.api_user_token : '';
      const sdk = createSdkHelper({ lookerHost, accessToken })
      setSdk(sdk)
    }
    else setIsReady(false)
  }, [clientSession, sdk])

  useEffect(() => {
    // console.log({ isReady })
  }, [isReady])

  return (
    < Router >
      <AppContext.Provider value={{
        clientSession, setClientSession,
        sdk, setSdk,
        initialHref, setInitialHref,
        isReady
      }}>
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
            initialHref={initialHref}>
          </PublicRoute>
          {/* catach all route */}
          <Route render={() => <Redirect to="/" />} />
        </Switch>
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
  // console.log('PrivateRoute')
  // console.log({ isSignedIn })

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
  ...rest }) => {
  // console.log('PublicRoute')
  // console.log({ isSignedIn })
  // console.log({ initialHref })


  const demoComponentMap = {
    "home": "SplashPage",
    "inventoryoverview": "Dashboard",
    "webanalytics": "Dashboard",
    "salesoverview": "Dashboard",
    "salescalendar": "CustomVis",
    "querybuilder": "QueryBuilder",
    "savedreports": "ReportBuilder",
  };

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
          : <Component {...props} />
      )} />
  );
};