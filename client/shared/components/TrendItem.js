import React from 'react';
import { Typography, ListItem } from '@material-ui/core';
import { NumberToColoredPercent } from './Accessories';
const { validIdHelper, appContextMap } = require('../utils/tools');

export function TrendItem({ apiItem, classes }) {
  // console.log("TrendItem")
  // console.log({ apiItem })
  // console.log({ fieldsOfInterest })

  let formattedText = []
  let cityName = <Typography key={validIdHelper(`TrendItem-${apiItem.key}-${apiItem.value}-Typography`)} variant="subtitle1" display="inline" >{apiItem.key}</Typography>
  formattedText.push(cityName)
  let numberToColoredPercent = <NumberToColoredPercent key={validIdHelper(`TrendItem-${apiItem.key}-${apiItem.value}-NumberedToColoredPercent`)} val={apiItem.value} />
  formattedText.push(numberToColoredPercent)

  return (
    <ListItem
      key={validIdHelper(`TrendItem-${apiItem.key}-${apiItem.value}`)}
      display="inline"
      className={`${classes.nested}`}>
      { formattedText}
    </ListItem >
  )
}
