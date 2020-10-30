import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import AppContext from './contexts/AppContext';
import SignIn from './components/SignIn/SignIn2';
import { checkForExistingSession, endSession } from './AuthUtils/auth';
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
      if (sessionResponse.session && sessionResponse.session.userProfile) {
        setClientSession(sessionResponse.session)
      }
    }

    fetchSession()

  }, [])

  return (
    < Router >
      <AppContext.Provider value={{ clientSession, setClientSession }}>
        <Switch>
          <Route path='/analytics' >
            <Home />
          </Route>
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


// const PrivateRoute = ({ component: Component, ...rest }) => {
//   return (

//     // Show the component only when the user is logged in
//     // Otherwise, redirect the user to /signin page
//     <Route {...rest} render={props => (
//       isLogin() ?
//         <Component {...props} />
//         : <Redirect to="/signin" />
//     )} />
//   );
// };

// // export default PrivateRoute;
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