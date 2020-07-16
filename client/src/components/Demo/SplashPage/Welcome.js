import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ApiHighlight } from '../../Highlights/Highlight';

import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, CircularProgress, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ResponsiveLine } from '@nivo/line';
const { validIdHelper } = require('../../../tools');



export function Welcome({ lookerContent, classes, onClick, userProfile }) {
  // console.log('Welcome')
  // console.log('userProfile', userProfile)


  return (
    <div
      className={` ${classes.maxHeight400}`}
    >
      <Typography variant="h5" >
        Welcome back, {userProfile.givenName}!
      </Typography>

      <Typography variant="subtitle1">
        <b><i>atom</i> fashion</b>
      </Typography>
      <Typography variant="subtitle1">
        build an atomic connection with your customers
      </Typography>
      <Typography variant="h6" >
        Blog
      </Typography>
      <Typography variant="h6" >
        Inventory Best Practices
      </Typography>
      <Typography variant="h6" >
        Macro Trends
      </Typography>
    </div >
  );
}
