import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'

import {
  BrowserRouter as Router,
  Switch,
  Route, Redirect
} from "react-router-dom";

import AppContext from './contexts/AppContext';
import SignIn from './components/SignIn/SignIn2';
import { checkForExistingSession } from './AuthUtils/auth';
// import { Home } from '@material-ui/icons';
import Home from './components/Home2';

function App2(props) {
  // console.log('App2')
  // console.log('props', props)

  const [clientSession, setClientSession] = useState({});

  //onload
  useEffect(() => {
    async function fetchSession() {
      const sessionResponse = await checkForExistingSession();
      // const sessionResponseData = await sessionResponse.json();

      console.log({ sessionResponse })
      console.log(sessionResponse.session.userProfile)

      // console.log(sessionResponseData.session)
      // console.log(sessionResponseData.session.userProfile)
      // if (sessionResponseData.session && sessionResponseData.session.userProfile) {
      //   console.log('inside ifff')
      //   setClientSession(sessionResponseData.session)
      // } else console.log('elllse')
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
          {/* <Route path='/analytics' >
            <Home />
          </Route> */}
          <PrivateRoute
            path='/analytics'
            isSignedIn={clientSession.userProfile ? true : false}
            component={Home}>
            {/* <Home /> */}
          </PrivateRoute>
          <Route path='/' exact>
            <SignIn />
          </Route>
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

  console.log({ isSignedIn })
  return (

    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route {...rest} render={(props) => (
      (isSignedIn) ?
        <Component {...props} />
        : <Redirect to="/" />
    )} />
  );
};



// const PublicRoute = ({ component: Component, restricted, ...rest }) => {
//   return (
//     // restricted = false meaning public route
//     // restricted = true meaning restricted route
//     <Route {...rest} render={props => (
//       isLogin() && restricted ?
//         <Redirect to="/dashboard" />
//         : <Component {...props} />
//     )} />
//   );
// };

// export default PublicRoute;