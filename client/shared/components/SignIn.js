import _ from 'lodash'
import React, { useContext } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Card, CardContent, Typography } from '@material-ui/core'
import { writeNewSession } from '../utils'
import jwt_decode from "jwt-decode"
const { validIdHelper, appContextMap, validateContent, errorHandler } = require('../utils');
import { useStyles } from './styles.js';
import Lottie from 'react-lottie';
import animationData from "@pbl-demo/images/ecommm-people.json";

export const SignIn = ({ content, initialUser }) => {

  let { clientSession, setClientSession } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const { logo, logoStyle, backgroundImageStyle } = content

  const responseGoogle = async (response) => {
    const decodedUser = jwt_decode(response.credential)
    console.log("client session: ",clientSession)
    try {
      let { session, status } = await writeNewSession({
        ...clientSession,
        userProfile: decodedUser,
        lookerUser: initialUser
      })
      console.log("session, signin: ", session)
      if (status === 200) {
        setClientSession(session)
      }
    } catch (err) {
      errorHandler.report(err)
    }
  }
  const googleClientId = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}.apps.googleusercontent.com`;
  const classes = useStyles();

  const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

  return (
    <div className={`${classes.rootSignIn} `}
      style={backgroundImageStyle ? backgroundImageStyle : ''}>
       {process.env.REACT_APP_PACKAGE_NAME === 'atom' &&
      <div style={{width: "100%", height:"100%"}}>
            <Lottie 
              options={defaultOptions}
            />
      </div>}
      <Card raised className={classes.signInCard} elevation={6}>
        <div className={classes.signInCardCopy}>
          <img
            src={logo}
            style={logoStyle ? logoStyle : ''}
          />
          <CardContent>
            {content.copyHeader ?
              <Typography variant="h4" gutterBottom>
                {content.copyHeader}
              </Typography> : ""}
            {content.copyBody ?
              <Typography variant="subtitle1" gutterBottom>
                {content.copyBody}
              </Typography> : ""}
            <div style={{display:"flex",justifyContent:"center", paddingTop: '2rem'}}>
            <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleLogin
              onSuccess={responseGoogle}
              onError={responseGoogle}
            />
            </GoogleOAuthProvider>
            </div>  
            {content.copyFooter ?
              <Typography variant="body2" color="textSecondary">
                {content.copyFooter}
              </Typography> : ""}
          </CardContent>
        </div>
      </Card>
    </div>
  )
}