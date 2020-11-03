import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';
// import AppContext from '../../../AppContext';
import AppContext from '../../../contexts/AppContext';
import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, CircularProgress, Grid, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { NaturalLanguage } from './NaturalLanguage';
const { validIdHelper } = require('../../../tools');

export function Welcome({ lookerContent, classes }) {
  console.log('Welcome')
  // const { userProfile, lookerUser } = useContext(AppContext)
  const { clientSession } = useContext(AppContext)
  const { userProfile, lookerUser } = clientSession

  console.log({ userProfile })
  console.log({ lookerUser })

  useEffect(() => {
    // setClientSideCode(rawSampleCode)
  }, [lookerContent, lookerUser]);

  return (
    <div
      className={`${classes.overflowScroll} ${classes.padding15}`}
      style={{ maxHeight: lookerContent.height }}
    >
      <Typography variant="h4">Welcome back, {userProfile.givenName}!</Typography>
      <br />
      <>
        {lookerContent.inlineQueries.map((inlineQuery, index) => (
          <NaturalLanguage
            key={`${validIdHelper('naturalLanguage-splashPage-' + index)}`}
            {...{ lookerContent, inlineQuery, index, classes }}
          />
        )
        )}
      </>
    </div >
  );
}
