import _ from 'lodash'
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab, Typography, Box, Grid, CircularProgress, Card, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
// import { LookerEmbedSDK } from '@looker/embed-sdk'
// import CodeFlyout from '../CodeFlyout';
// import useStyles from './styles.js';
// import { TabPanel, a11yProps } from './helpers.js';
import './Home.css';
const { validIdHelper } = require('../tools');


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },
    flexCentered: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        minWidth: '100%',
        minHeight: '100%',
    },
    h100: {
        height: '100%'
    },
}));


export default function SignIn(props) {

    // console.log('SignIn')
    // console.log('props', props)

    const { googleClientId, onSuccess, onFailure } = props;

    const classes = useStyles();


    return (
        <div className={`${classes.root} demoComponent ${classes.h100}`}>
            <Grid container
                key={validIdHelper('sign in page')}
                className={`${classes.h100}`}>
                <Grid item sm={12} >
                    <Card className={`${classes.card} ${classes.flexCentered} sign-in-background-img`}>

                        <GoogleLogin
                            clientId={googleClientId}
                            buttonText="Login"
                            onSuccess={onSuccess}
                            onFailure={onSuccess}
                            cookiePolicy={'single_host_origin'}
                        />
                    </Card>
                </Grid>

            </Grid>
        </div>
    )
}