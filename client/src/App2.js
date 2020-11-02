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
    console.log('useEffect [clientSession]')
    console.log({ clientSession })
  }, [clientSession])

  /**
   *   <Switch>
            <Route path={'login'} render={props => <LoginContainer {...props} />} />
          </Switch>
   */
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
            {/* render={props => <Home {...props} />}> */}
          </PrivateRoute>
          <PublicRoute
            path='/'
            // exact
            isSignedIn={clientSession.userProfile ? true : false}
            component={SignIn}>
            {/* // render={props => <SignIn {...props} />}> */}
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
  // console.log('PrivateRoute')
  // console.log('isSignedIn', isSignedIn)
  // console.log('Component', Component)
  return (

    <Route exact
      {...rest} render={(props) => (
        (isSignedIn) ?
          <Component {...props} />
          : <Redirect to="/" />
      )} />
  );
};



const PublicRoute = ({ component: Component,
  isSignedIn,
  restricted, ...rest }) => {
  // console.log('PublicRoute')
  // console.log('isSignedIn', isSignedIn)
  // console.log('Component', Component)
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route exact
      {...rest} render={props => (
        (isSignedIn) ?
          <Redirect to="/analytics/:democomponent" />
          : <Component {...props} />
      )} />
  );
};

// export default PublicRoute;