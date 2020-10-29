import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, CardActions, CardContent, Typography } from '@material-ui/core'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import '../Home.css';
import UsecaseContent from '../../usecaseContent.json';
import useStyles from './styles.js';
import AppContext from '../../contexts/AppContext';

const { validIdHelper } = require('../../tools');





export default function SignIn(props) {

  // console.log('SignIn')
  // console.log('props', props)

  // const { googleClientId, onSuccess, onFailure, usecaseFromUrl } = props;
  // console.log('usecaseFromUrl', usecaseFromUrl)

  const { session, setSession } = useContext(AppContext)

  const responseGoogle = (response) => {
    if (response.error) {
      console.log('response.error', response.error)
    } else {
      setSession((session) => { return { ...session, userProfile: response.profileObj } })
    }
  }
  const googleClientId = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}.apps.googleusercontent.com`

  const usecaseFromUrl = usecaseHelper();


  const classes = useStyles();

  const backgroundImageInt = Math.floor(Math.random() * 4) + 1;
  const backgroundImage = require(`../../images/${usecaseFromUrl}_background${backgroundImageInt}.jpg`);
  const logoImage = require(`../../images/${usecaseFromUrl}_logo_black.svg`)

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
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
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

export function usecaseHelper() {
  let keyArr = Object.keys(UsecaseContent);
  let url = window.location.href;
  for (let i = 0; i < keyArr.length; i++) {
    if (url.indexOf(keyArr[i]) > -1) {
      return keyArr[i];
    }
  }
  return 'atom';
}