import React from 'react';
import { Typography, Grid, ListItem } from '@material-ui/core';
import { NumberToColoredPercent } from './Accessories';
import { ApiHighlight } from './Accessories/Highlight';

console.log({ ApiHighlight })

const { validIdHelper } = require('../utils/tools');


export function TrendItem({ trendItem, classes, fieldsOfInterest, index }) {

  // console.log("TrendItem")
  // console.log({ trendItem })

  let formattedText = [];
  fieldsOfInterest.map(field => {
    if (field === "change") {
      let numberToColoredPercent = <NumberToColoredPercent val={trendItem[field]} />
      formattedText.push(numberToColoredPercent)
    } else formattedText.push(<Typography variant="subtitle1" display="inline">{trendItem[field]}</Typography>)
  })

  return (

    <ApiHighlight
      key={validIdHelper(`trendItem-${index}`)}
      classes={classes}
    >
      <ListItem

        key={validIdHelper(`trendItem-listItem-${index}`)}>
        {formattedText}
      </ListItem>
    </ApiHighlight>
  )
}
