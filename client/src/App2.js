import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Switch, Route, Redirect, useParams } from "react-router-dom";
import AppContext from './contexts/AppContext';
import { checkForExistingSession, createSdkHelper } from './AuthUtils/auth';
import SignIn from './components/SignIn/SignIn2';
import Home from './components/Home/Home2';


function App(props) {

  const [clientSession, setClientSession] = useState({});
  const [sdk, setSdk] = useState();
  const [initialHref, setInitialHref] = useState(window.location.href);

  //onload
  useEffect(() => {
    console.log('window.location', window.location)
    async function fetchSession() {
      const sessionResponse = await checkForExistingSession();
      console.log({ sessionResponse });
      if (sessionResponse.session && sessionResponse.session.userProfile) {

        const lookerHost = sessionResponse.session.lookerHost ? sessionResponse.session.lookerHost : this.state.lookerHost;
        const accessToken = sessionResponse.session.lookerApiToken ? sessionResponse.session.lookerApiToken.api_user_token : '';
        const sdk = createSdkHelper({ lookerHost, accessToken })

        setSdk(sdk)
        setClientSession(sessionResponse.session)
      }
    }
    fetchSession()
  }, [])

  return (
    < Router >
      <AppContext.Provider value={{
        clientSession, setClientSession,
        sdk, setSdk,
        initialHref, setInitialHref
      }}>
        <Switch>
          <PrivateRoute
            path='/analytics/:democomponent'
            isSignedIn={clientSession.userProfile ? true : false}
            component={Home}>
          </PrivateRoute>
          <PublicRoute
            path='/'
            exact
            isSignedIn={clientSession.userProfile ? true : false}
            component={SignIn}>
          </PublicRoute>
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
  ...rest }) => {
  return (

    <Route exact
      {...rest} render={(props, location) => (
        (isSignedIn) ?
          <Component {...props} />
          : <Redirect
            //to="/" 
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
      )} />
  );
};


const PublicRoute = ({ component: Component,
  isSignedIn,
  // restricted, 
  ...rest }) => {
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route exact
      {...rest} render={(props, location) => (
        (isSignedIn) ?
          <Redirect
            //to="/analytics/:democomponent" 
            to={{
              pathname: "/analytics/:democomponent",
              state: { from: location }
            }}
          />
          : <Component {...props} />
      )} />
  );
};