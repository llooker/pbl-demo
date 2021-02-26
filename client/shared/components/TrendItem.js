import React from 'react';
import { Typography, Grid, ListItem } from '@material-ui/core';
import { NumberToColoredPercent } from './Accessories';

export function TrendItem({ trendItem, classes, fieldsOfInterest }) {
  let formattedText = [];
  fieldsOfInterest.map(field => {
    if (field === "change") {
      let numberToColoredPercent = <NumberToColoredPercent val={trendItem[field]} />
      formattedText.push(numberToColoredPercent)
    } else formattedText.push(<Typography variant="subtitle1" display="inline">{trendItem[field]}</Typography>)
  })

  return (
    <ListItem
      chip
    // className={`${classes.nested} ${classes.roundedTab} ${classes.ml12}`}
    >
      {formattedText}
    </ListItem>
  )
}
