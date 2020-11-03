import _ from 'lodash'
import React, { useContext } from 'react';
import { useHistory, useParams, useLocation } from "react-router-dom";
import { GoogleLogin } from 'react-google-login';
import AppContext from '../../contexts/AppContext';
import { writeNewSession } from '../../AuthUtils/auth';
import UsecaseContent from '../../usecaseContent.json';
import { initialLookerUser } from '../../LookerHelpers/defaults'
import useStyles from './styles.js';
import '../Home.css';
import { Grid, Card, CardActions, CardContent, Typography } from '@material-ui/core'
const { validIdHelper, usecaseHelper } = require('../../tools');

export default function SignIn(props) {
  // console.log('SignIn');
  // console.log('props', props)

  let history = useHistory();
  let location = useLocation();
  let { clientSession, setClientSession } = useContext(AppContext)
  let { democomponent } = useParams();
  // console.log({ democomponent })
  // console.log({ history })
  // console.log({ location })


  const responseGoogle = async (response) => {
    if (response.error) {
      console.log('response.error', response.error)
    } else {
      let newSession = await writeNewSession({ ...clientSession, userProfile: response.profileObj, lookerUser: initialLookerUser })
      setClientSession(newSession.session)
      let urlAsString = `/analytics/${democomponent}`
      history.push(urlAsString); //for now
    }
  }
  const googleClientId = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}.apps.googleusercontent.com`
  const usecaseFromUrl = usecaseHelper(UsecaseContent);

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