import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ApiHighlight } from '../../Highlights/Highlight';

import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, CircularProgress, Grid, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ResponsiveLine } from '@nivo/line';
import { VectorThumbnail } from './VectorThumbnail';
import { NaturalLanguage } from './NaturalLanguage';
const { validIdHelper } = require('../../../tools');



export function ActionableInsights({ lookerContent, classes, onClick, vectors }) {
  const [apiContent, setApiContent] = useState([]);


  return (
    <div
      className={` ${classes.maxHeight400}`}
    >
      <Typography variant="h5" >
        Actionable Insights
      </Typography>

      <Grid container
        spacing={3}>
        {lookerContent.inlineQueries.map((item, index) => (
          <NaturalLanguage
            key={`${validIdHelper('naturalLanguage-splashPage-' + item.id)}`}
            {...{ lookerContent, item, index, classes }}
          />
        )
        )}
      </Grid>
      <Divider className={`${classes.divider} ${classes.mb12} ${classes.mt12}`} />
      <Grid container
        spacing={3}>
        <Grid item sm={12}>
          <Typography variant="h6" >
            Popular Analysis
          </Typography></Grid>
        {lookerContent.vectors.map((item, index) => (
          <VectorThumbnail
            key={`${validIdHelper('vectorThumbnail-splashPage-' + item.id)}`}
            {...{ lookerContent, item, classes }}
            onClick={() => onClick(item.id, 1)}
          />
        )
        )}
      </Grid>

    </div >
  );
}
