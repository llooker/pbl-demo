import _ from 'lodash'
import React, { useContext, useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import { Grid, Card, CardActions, CardContent, CardFooter, Typography } from '@material-ui/core'
import { writeNewSession, createSdkHelper } from '../utils'
const { validIdHelper, appContextMap, validateContent } = require('../utils/tools');
import { useStyles, topBarBottomBarHeight, additionalHeightForFlyout } from './styles.js';

export const SignIn = ({ content, initialUser }) => {

  let { clientSession, setClientSession, sdk, setSdk, initialHref, setInitialHref } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const { packageName } = clientSession;
  const { backgroundImage, logo, logoStyle, backgroundImageStyle } = content

  const responseGoogle = async (response) => {
    if (response.error) {
    } else {
      let newSession = await writeNewSession({ ...clientSession, userProfile: response.profileObj, lookerUser: initialUser }) //initialLookerUser

      const lookerBaseUrl = newSession.session.lookerBaseUrl ? newSession.session.lookerBaseUrl : '';
      const accessToken = newSession.session.lookerApiToken ? newSession.session.lookerApiToken.api_user_token : '';
      const sdk = createSdkHelper({ lookerBaseUrl, accessToken })

      setClientSession(newSession.session);
      setSdk(sdk)
    }
  }
  const googleClientId = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}.apps.googleusercontent.com`;
  const classes = useStyles();

  return (
    <div className={`${classes.root} demoComponent ${classes.height100Percent}`}>
      <Grid container
        key={validIdHelper('sign in page')}
        className={`${classes.height100Percent}`}>
        <Grid item sm={12} className={'sign-in-background-img'}
          style={backgroundImageStyle ? backgroundImageStyle : ''}
        >
          <Card className={classes.signInCard}>
            <div className={classes.signInCardCopy}>
              <img
                src={logo}
                style={logoStyle ? logoStyle : ''}
              />
              <CardContent >
                {content.copyHeader ?
                  <Typography variant="h4" gutterBottom>
                    {content.copyHeader}
                  </Typography> : ""}
                {content.copyBody ?
                  <Typography variant="subtitle1" gutterBottom>
                    {content.copyBody}
                  </Typography> : ""}

                <GoogleLogin
                  clientId={googleClientId}
                  buttonText="Login"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={'single_host_origin'}
                  className={classes.mb12}
                />
                {content.copyFooter ?
                  <Typography variant="body2" color="textSecondary">
                    {content.copyFooter}
                  </Typography> : ""}
              </CardContent>
            </div>
          </Card>
        </Grid>
      </Grid>
    </div >
  )
}