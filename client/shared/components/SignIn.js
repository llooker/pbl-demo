import _ from 'lodash'
import React, { useContext, useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import { useStyles, topBarBottomBarHeight, additionalHeightForFlyout } from './styles.js';
// import '../Home.css';
import { Grid, Card, CardActions, CardContent, Typography } from '@material-ui/core'
// import { SignInContent } from '../../config'
import { writeNewSession, createSdkHelper } from '@pbl-demo/components/Utils/auth';
const { validIdHelper, appContextMap, validateContent } = require('../utils/tools');
// import { initialUser } from './LookerHelpers/'

export const SignIn = ({ content, initialUser }) => {
  console.log('SignIn');
  console.log({ content })
  console.log({ initialUser })

  let { clientSession, setClientSession, sdk, setSdk, initialHref, setInitialHref } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const { packageName } = clientSession;
  const { signInBackgroundImage, signInLogo } = content

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
  // const logoImage = packageName ? require(`../../images/logo_text.svg`).default : "";
  // const backgroundImageInt = Math.floor(Math.random() * 4) + 1;
  // const backgroundImage = packageName ? require(`../../images/background${backgroundImageInt}.jpg`).default : "";


  return (
    <div className={`${classes.root} demoComponent ${classes.h100}`}>
      <Grid container
        key={validIdHelper('sign in page')}
        className={`${classes.h100}`}>
        <Grid item sm={12} className={'sign-in-background-img'}
          style={{
            backgroundImage: `url(${signInBackgroundImage})`,
            backgroundSize: 'cover'
          }}
        >
          <Card className={classes.card}>
            <div className={classes.cardCopy}>
              {/* <img
                src={logoImage}
              /> */}
              <CardContent >
                <Typography variant="h5" component="h2">
                  {content.cardHeader}
                </Typography>
                <Typography variant="body2" component="p">
                  {content.cardBody}
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