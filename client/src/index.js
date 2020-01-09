import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { GoogleLogin } from 'react-google-login';

const responseGoogle = (response) => {
    console.log(response);
    console.log('response.profileObj');
    console.log(response.profileObj); //working
}

// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
    <GoogleLogin
        clientId="1026815692414-cdeeupbmb7bbjcmfovmr6bqktsi86c2u.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
    />,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
