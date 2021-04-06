import React from 'react';
import { Typography, ListItem } from '@material-ui/core';
import { NumberToColoredPercent } from './Accessories';

export function TrendItem({ apiItem, classes }) {
  // console.log("TrendItem")
  // console.log({ apiItem })
  // console.log({ fieldsOfInterest })

  let formattedText = []
  let cityName = <Typography variant="subtitle1" display="inline">{apiItem.key}</Typography>
  formattedText.push(cityName)
  let numberToColoredPercent = <NumberToColoredPercent val={apiItem.value} />
  formattedText.push(numberToColoredPercent)

  return (
    <ListItem display="inline" className={`${classes.nested}`}>
      { formattedText}
    </ListItem >
  )
}
