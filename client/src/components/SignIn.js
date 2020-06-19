import _ from 'lodash'
import React, { useState, useEffect } from 'react';
import { AppBar, Tabs, Tab, Typography, Box, Grid, CircularProgress, Card, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
// import { LookerEmbedSDK } from '@looker/embed-sdk'
// import CodeFlyout from '../CodeFlyout';
// import useStyles from './styles.js';
// import { TabPanel, a11yProps } from './helpers.js';
// const { validIdHelper } = require('../../../tools');

export default function SignIn(props) {

    // console.log('SignIn')
    // console.log('props', props)

    const { googleClientId, onSuccess, onFailure } = props;


    return (
        <div className="App h-100">
            <div className="home container p-5 position-relative h-100">
                <div className="row pt-3 h-25"></div>
                <div className="row pt-3 h-50">
                    <div className="col-sm-4">
                    </div>
                    <div className="col-sm-4 bg-light h-100 v-center border rounded p-5">
                        <div>
                            <h2>PBL App</h2>
                            <p>Login with Google to get started</p>
                        </div>
                        <div className="pt-1">
                            <GoogleLogin
                                clientId={googleClientId}
                                buttonText="Login"
                                onSuccess={onSuccess}
                                onFailure={onSuccess}
                                cookiePolicy={'single_host_origin'}
                            /></div>
                    </div>
                </div>
            </div>
        </div >
    )
}