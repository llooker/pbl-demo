import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ApiHighlight } from '../../Highlights/Highlight';

import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, CircularProgress, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ResponsiveLine } from '@nivo/line';
import { VectorThumbnail } from './VectorThumbnail';
const { validIdHelper } = require('../../../tools');



export function ActionableInsights({ lookerContent, classes, onClick, vectors }) {

  return (
    <div>
      <Typography variant="h5" >
        Actionable Insights
      </Typography>
      <Grid container
        spacing={3}>
        <Grid item sm={12}>
          <Typography variant="h6" >
            Popular Analysis
          </Typography></Grid>
        {lookerContent.vectors.map((item, index) => (
          <VectorThumbnail
            {...{ lookerContent, item, classes }}
            onClick={() => onClick(item.id, 1)}
          />
        )
        )}
      </Grid>

    </div >
  );
}
