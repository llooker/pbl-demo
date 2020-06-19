import _ from 'lodash'
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, CardActions, CardContent, Typography } from '@material-ui/core'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import './Home.css';
const { validIdHelper } = require('../tools');


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    flexCentered: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        minWidth: 125,
        minHeight: 175,
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%)`,
        position: 'absolute',
        textAlign: 'center',
        padding: 50
    },
    h100: {
        height: '100%'
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    actions: {
        alignItems: 'center',
        justifyContent: 'center'
    }
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
                <Grid item sm={12} className={'sign-in-background-img'}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                Welcome to Atom Fashion
                            </Typography>
                            <Typography variant="body2" component="p">
                                Please sign in to access <br /> your merchant portal
                            </Typography>
                        </CardContent>
                        <CardActions className={`${classes.actions}`}>
                            <GoogleLogin
                                clientId={googleClientId}
                                buttonText="Login"
                                onSuccess={onSuccess}
                                onFailure={onSuccess}
                                cookiePolicy={'single_host_origin'}
                            />
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </div >
    )
}