import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';
import AppContext from '../../../AppContext';
import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, CircularProgress, Grid, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { NaturalLanguage } from './NaturalLanguage';
const { validIdHelper } = require('../../../tools');

export function Welcome({ lookerContent, classes }) {
  // console.log('Welcome')
  const { userProfile, lookerUser } = useContext(AppContext)

  useEffect(() => {
    // setClientSideCode(rawSampleCode)
  }, [lookerContent, lookerUser]);

  return (
    <div
      className={`${classes.overflowScroll} ${classes.padding15}`}
      style={{ maxHeight: lookerContent.height }}
    >
      <Typography variant="h4">Welcome back</Typography>
      <br />
      <Typography variant="subtitle1" display="inline">
        Hi <b>{userProfile.givenName}</b>, hope you're having a good day. Here are a few things you might want to know.
      </Typography>
      <br />
      <>
        {lookerContent.inlineQueries.map((item, index) => (
          <NaturalLanguage
            key={`${validIdHelper('naturalLanguage-splashPage-' + index)}`}
            {...{ lookerContent, item, index, classes }}
          />
        )
        )}
      </>
    </div >
  );
}
