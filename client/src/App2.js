import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'

import {
  BrowserRouter as Router,
  Switch,
  Route, Redirect
} from "react-router-dom";

import AppContext from './contexts/AppContext';
import { checkForExistingSession } from './AuthUtils/auth';
import SignIn from './components/SignIn/SignIn2';
import Home from './components/Home/Home2';

function App2(props) {
  // console.log('App2')
  // console.log('props', props)

  const [clientSession, setClientSession] = useState({});

  //onload
  useEffect(() => {
    async function fetchSession() {
      const sessionResponse = await checkForExistingSession();

      if (sessionResponse.session && sessionResponse.session.userProfile) {
        setClientSession(sessionResponse.session)
      } //else console.log('elllse')
    }

    fetchSession()

  }, [])

  useEffect(() => {
    console.log({ clientSession })
  }, [clientSession])


  return (
    < Router >
      <AppContext.Provider value={{
        clientSession, setClientSession
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

App2.propTypes = {

}

export default App2


const PrivateRoute = ({
  component: Component,
  isSignedIn,
  ...rest }) => {
  console.log('isSignedIn', isSignedIn)
  return (

    <Route {...rest} render={(props) => (
      (isSignedIn) ?
        <Component {...props} />
        : <Redirect to="/" />
    )} />
  );
};



const PublicRoute = ({ component: Component,
  isSignedIn,
  restricted, ...rest }) => {
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route {...rest} render={props => (
      (isSignedIn) ?
        <Redirect to="/analytics/:democomponent" />
        : <Component {...props} />
    )} />
  );
};

// export default PublicRoute;