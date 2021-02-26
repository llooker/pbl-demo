import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { validIdHelper } from '../utils/tools';

export function TrendItem({ trendItem, classes, fieldsOfInterest }) {
  // console.log('TrendItem')
  // console.log({ trendItem })
  // console.log({ classes })
  // console.log({ fieldsOfInterest })

  let textStr = '';
  fieldsOfInterest.map(field => {
    textStr += " " + trendItem[field]
  })

  return (
    <Grid item >
      <Typography variant="subtitle1">{textStr}</Typography>
    </Grid>
  )
}
