import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';
import AppContext from '../../../AppContext';
import { ApiHighlight } from '../../Highlights/Highlight';
import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, CircularProgress, Grid, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ResponsiveLine } from '@nivo/line';
import { VectorThumbnail } from './VectorThumbnail';
import { NaturalLanguage } from './NaturalLanguage';
const { validIdHelper } = require('../../../tools');



export function PopularAnalysis({ lookerContent, classes, handleMenuItemSelect }) {
  const [apiContent, setApiContent] = useState([]);

  return (

    <Card elevation={1} className={classes.padding30}>
      <div
        className={`${classes.overflowScroll}`}
        style={{ height: lookerContent.height }}
      >
        <Grid container
          spacing={3}>
          <Grid item sm={12}>
            <Typography variant="h6" align="center" color="secondary">
              Helpful Dashboards
          </Typography></Grid>
          {lookerContent.vectors.map((item, index) => {
            return (
              <VectorThumbnail
                key={`${validIdHelper('vectorThumbnail-splashPage-' + index)}`}
                {...{ lookerContent, item, classes, handleMenuItemSelect }}
              />
            )
          }
          )}
        </Grid>

      </div >
    </Card>
  );
}
