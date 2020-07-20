import _ from 'lodash'
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, CardActions, CardContent, Typography } from '@material-ui/core'
import { grey, orange } from '@material-ui/core/colors';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import './Home.css';
const { validIdHelper } = require('../tools');
const lightGrey = grey[200];


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
    minWidth: 350,
    minHeight: 500,
    left: '75%',
    top: '50%',
    transform: `translate(-75%, -50%)`,
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: lightGrey
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
  },
  cardCopy: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
    margin: '0',
    width: '80%',
  }
}));


export default function SignIn(props) {

  // console.log('SignIn')
  // console.log('props', props)

  const { googleClientId, onSuccess, onFailure, } = props;
  const classes = useStyles();
  let usecaseFromUrl = window.location.pathname.replace(/^\/([^\/]*).*$/, '$1');
  const backgroundImageInt = Math.floor(Math.random() * 4) + 1;
  const backgroundImage = require(`../images/${usecaseFromUrl}_background${backgroundImageInt}.jpg`);
  const logoImage = require(`../images/${usecaseFromUrl}_logo_black.svg`)

  return (
    <div className={`${classes.root} demoComponent ${classes.h100}`}>
      <Grid container
        key={validIdHelper('sign in page')}
        className={`${classes.h100}`}>
        <Grid item sm={12} className={'sign-in-background-img'}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover'
          }}
        >
          <Card className={classes.card}>
            <div className={classes.cardCopy}>
              <img
                src={logoImage}
              />
              <CardContent >
                <Typography variant="h5" component="h2">
                  Welcome
                            </Typography>
                <Typography variant="body2" component="p">
                  Please sign in to access <br /> your merchant portal
                            </Typography>
              </CardContent>
              <CardActions className={`${classes.actions}`} >
                <GoogleLogin
                  clientId={googleClientId}
                  buttonText="Login"
                  onSuccess={onSuccess}
                  onFailure={onSuccess}
                  cookiePolicy={'single_host_origin'}
                />
              </CardActions>
            </div>
          </Card>
        </Grid>
      </Grid>
    </div >
  )
}