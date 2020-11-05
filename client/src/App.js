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
  const [initialHref, setInitialHref] = useState(); // = useState(window.location.href);


  //onload
  useEffect(() => {
    // console.log("inside onload useEffect")
    async function fetchSession() {

      const sessionResponse = await checkForExistingSession();
      if (sessionResponse.session && sessionResponse.session.userProfile) {

        const lookerHost = sessionResponse.session.lookerHost ? sessionResponse.session.lookerHost : '';
        const accessToken = sessionResponse.session.lookerApiToken ? sessionResponse.session.lookerApiToken.api_user_token : '';
        const sdk = createSdkHelper({ lookerHost, accessToken })

        setClientSession(sessionResponse.session)
        setSdk(sdk)

        localStorage.setItem("clientSession", JSON.stringify(sessionResponse.session));
        // localStorage.setItem("sdk", JSON.stringify(sdk));
      }
    }

    if (localStorage.getItem("clientSession")) { //&& localStorage.getItem(sdk)) {
      // console.log("localStorage ifff")
      let clientSessionLocalStorage = JSON.parse(localStorage.getItem("clientSession"))
      // let sdkLocalStorage = JSON.parse(localStorage.getItem("sdk"))
      // setSdk(sdkLocalStorage)

      const lookerHost = clientSessionLocalStorage.lookerHost ? clientSessionLocalStorage.lookerHost : '';
      const accessToken = clientSessionLocalStorage.lookerApiToken ? clientSessionLocalStorage.lookerApiToken.api_user_token : '';
      const sdk = createSdkHelper({ lookerHost, accessToken })
      setSdk(sdk);
      setClientSession(clientSessionLocalStorage)
    } else {
      // console.log("localStorage else")
      fetchSession(); //make async call
    }

  }, [])

  // console.log({ sdk })
  // console.log({ clientSession })

  useEffect(() => {
    // console.log("useEffect sdk")
    // console.log({ sdk })
  }, [sdk])


  return (
    < Router >
      <AppContext.Provider value={{
        clientSession, setClientSession,
        sdk, setSdk,
        initialHref, setInitialHref
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
    "splashpage19": "SplashPage",
    "customfilter5": "Dashboard",
    "simpledashboard9": "Dashboard",
    "customfilter1": "Dashboard",
    "customvis": "CustomVis",
    "querybuilderexplorelite": "QueryBuilder",
    "reportbuilder14": "ReportBuilder",
  };

  let urlToUse = '/analytics/splashpage19';
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