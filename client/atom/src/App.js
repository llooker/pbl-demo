import _ from 'lodash'
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import AppContext from './contexts/AppContext';
import { checkForExistingSession, createSdkHelper } from './AuthUtils/auth';
import SignIn from './components/SignIn/SignIn';
import Home from './components/Home/Home';

import * as DemoComponentsContentArr from './content';
import { validIdHelper } from './tools';

function App(props) {

  const [clientSession, setClientSession] = useState({});
  const [sdk, setSdk] = useState();
  const [initialHref, setInitialHref] = useState();
  const [isReady, setIsReady] = useState(false);

  //onload
  useEffect(() => {
    async function fetchSession() {

      const sessionResponse = await checkForExistingSession();
      if (sessionResponse.session) {

        const lookerBaseUrl = sessionResponse.lookerBaseUrl ? sessionResponse.lookerBaseUrl : undefined;
        const accessToken = sessionResponse.lookerApiToken ? sessionResponse.lookerApiToken.api_user_token : undefined;

        if (lookerBaseUrl && accessToken) {
          const sdk = createSdkHelper({ accessToken, lookerBaseUrl })
          setSdk(sdk)
        }

        setClientSession(sessionResponse.session)
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
          : <Component {...props} />
      )} />
  );
};