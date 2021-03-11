import React from 'react';
import { Typography, ListItem } from '@material-ui/core';
import { NumberToColoredPercent } from './Accessories';
import { ApiHighlight } from './Accessories/Highlight';

const { validIdHelper } = require('../utils/tools');


export function TrendItem({ apiItem, item, item: { fieldsOfInterest }, classes, index }) {
  // console.log("TrendItem")
  // console.log({ item })
  // console.log({ index })

  let formattedText = [];
  fieldsOfInterest.map(field => {
    if (field === "change") {
      let numberToColoredPercent = <NumberToColoredPercent val={apiItem[field]} />
      formattedText.push(numberToColoredPercent)
    } else formattedText.push(<Typography variant="subtitle1" display="inline">{apiItem[field]}</Typography>)
  })

  return (
    <ApiHighlight
      key={validIdHelper(`ApiHighlight-TrendItem-${index}`)}
      id={validIdHelper(`ApiHighlight-TrendItem-${index}`)}
      classes={classes}
    >
      <ListItem>
        {formattedText}
      </ListItem>
    </ApiHighlight>
  )
}
