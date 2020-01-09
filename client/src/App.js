import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom'

// import Navbar from './components/Navbar';
// import Home from './components/Home';

const fakeAuth = {
  isAuthenticated: false,
  authenticated(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) //fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100)
  }
}

const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>

class Login extends React.Component {
  state = {
    redirectToRefer: false
  }
  login = () => {
    fakeAuth.authenticated(() => {
      this.setState(() => ({
        redirectToRefer: true
      }))
    })
  }
  render() {
    const { redirectToRefer } = this.state
    const { from } = this.props.location.state || { from: { pathname: '/public' } }
    if (redirectToRefer === true) {
      return (
        <Redirect to={from} />
      )
    }

    return (
      <div>
        <p>You must login to view this page at {from.pathname}</p>
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    fakeAuth.isAuthenticated === true ? <Component {...props} /> : <Redirect to={{
      pathname: '/login', state: {
        from: props.location
      }
    }} />
  )} />
)

const AuthButton = withRouter(({ history }) => (
  fakeAuth.isAuthenticated === true
    ?
    <p>
      Welcome! <button onClick={() => {
        fakeAuth.signOut(() => history.push('/')
        )
      }}>Sign Out</button>
    </p >
    :
    <p>
      You are not logged in
    </p>
))

class App extends React.Component {
  render() {

    console.log('fakeAuth.isAuthenticated', fakeAuth.isAuthenticated)
    return (
      <Router>
        <div>
          <AuthButton />
          <ul>
            <li><Link to='/public'>Public Page</Link></li>
            <li><Link to='/protected'>Protected Page</Link></li>
          </ul>

          <Route path='/public' component={Public} />
          <Route path='/login' component={Login} />
          <PrivateRoute path='/protected' component={Protected} />
        </div>
      </Router>
      // <Login />
    )
  }
}
export default App