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
      if (sessionResponse.session && sessionResponse.session.userProfile) {

        const lookerBaseUrl = sessionResponse.lookerBaseUrl ? sessionResponse.lookerBaseUrl : '';
        const accessToken = sessionResponse.lookerApiToken ? sessionResponse.lookerApiToken.api_user_token : '';
        const sdk = createSdkHelper({ accessToken, lookerBaseUrl })

        setClientSession(sessionResponse.session)
        setSdk(sdk)
      }
    }
    fetchSession(); //make async call
  }, [])

  useEffect(() => {
    if (clientSession && sdk) setIsReady(true)
    else if (clientSession.userProfile) {
      const lookerBaseUrl = clientSession.lookerBaseUrl ? clientSession.lookerBaseUrl : '';
      const accessToken = clientSession.lookerApiToken ? clientSession.lookerApiToken.api_user_token : '';
      const sdk = createSdkHelper({ accessToken, lookerBaseUrl })
      setSdk(sdk)
    }
    // else setIsReady(false)
  }, [clientSession, sdk])

  // console.log({ clientSession })


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