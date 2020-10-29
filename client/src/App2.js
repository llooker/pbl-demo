import React, { useState, useEffect, useContext } from 'react';
// import { isLogin } from '../utils';
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import AppContext from './contexts/AppContext';
import SignIn from './components/SignIn/SignIn';
import UsecaseContent from './usecaseContent.json';


function App2(props) {


  const checkForExistingSession = async () => {
    let sessionResponse = await fetch('/readsession', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const sessionResponseData = await sessionResponse.json();
    console.log('sessionResponseData', sessionResponseData)
  }

  const [session, setSession] = useState(checkForExistingSession());

  // console.log({ session })
  useEffect(() => {
    async function writeSession() {
      if (session.userProfile) {
        let sessionData = await fetch('/writesession', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userProfile: session.userProfile,
            // lookerUser: this.state.lookerUser 
          })
        })
      }
      // else {
      //   let sessionData = await fetch('/endsession', {
      //     method: 'POST',
      //     headers: {
      //       Accept: 'application/json',
      //       'Content-Type': 'application/json'
      //     }
      //   })
      //   setSession({})
      // }
    }
    writeSession();
  }, [session])


  return (
    <Router>
      <AppContext.Provider value={{ session, setSession }}>
        <Switch>
          {/* <Route path='/examples/homepage-sidebar' component={HomePageWithSidebar} />
        <Route path='/examples/embed-sdk' component={EmbedSDK} />
        <Route path='/examples/api-data-backend' component={APIDataContainer} /> */}
          <Route path='/' default >
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