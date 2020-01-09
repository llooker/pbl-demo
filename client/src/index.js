import React from 'react';
import ReactDOM from 'react-dom';
import { Route, NavLink, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import './index.css';
import App from './App';
import Users from './components/Users'
import Contact from './components/Contact'
import Notfound from './components/Notfound'
import * as serviceWorker from './serviceWorker';
// import { GoogleLogin } from 'react-google-login';

// const responseGoogle = (response) => {
//     console.log(response);
//     console.log('response.profileObj');
//     console.log(response.profileObj); //working
// }

const fakeAuth = {}

const routing = (
    <Router>
        <div>
            <ul>
                <li>
                    <NavLink exact activeClassName="active" to="/">
                        Home
          </NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/users">
                        Users
          </NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/contact">
                        Contact
          </NavLink>
                </li>
            </ul>
            <Switch>
                <Route exact activeClassName="active" path="/" component={App} />
                <Route activeClassName="active" path="/users/:id" component={Users} />
                <Route activeClassName="active" path="/contact" component={Contact} />
                <Route component={Notfound} />
            </Switch>
        </div>
    </Router>
)

ReactDOM.render(<App />, document.getElementById('root')) //routing
// ReactDOM.render(
//     <GoogleLogin
//         clientId="1026815692414-cdeeupbmb7bbjcmfovmr6bqktsi86c2u.apps.googleusercontent.com"
//         buttonText="Login"
//         onSuccess={responseGoogle}
//         onFailure={responseGoogle}
//         cookiePolicy={'single_host_origin'}
//     />,
//     document.getElementById('root')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
