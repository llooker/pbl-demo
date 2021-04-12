import React from 'react';
import { Typography, ListItem } from '@material-ui/core';
import { NumberToColoredPercent } from './Accessories';

import _ from 'lodash'

const { validIdHelper, appContextMap } = require('../utils/tools');

export function TrendItem({ apiItem, classes, item, helperFunctionMapper }) {
  // console.log("TrendItem")
  // console.log({ apiItem })
  // console.log({ fieldsOfInterest })
  // console.log({ item })

  let formattedText = []
  let cityName = <Typography key={validIdHelper(`TrendItem-${apiItem.key}-${apiItem.value}-Typography`)} variant="subtitle1" display="inline" className={classes.mr6}>{apiItem.key}</Typography>
  formattedText.push(cityName)
  let numberToColoredPercent = <NumberToColoredPercent key={validIdHelper(`TrendItem-${apiItem.key}-${apiItem.value}-NumberedToColoredPercent`)} val={apiItem.value} />
  formattedText.push(numberToColoredPercent)

  const onClickHandler = (event) => {
    console.log("onClickHandler")
    // console.log('apiItem.key', apiItem.key)
    let copiedItem = { ...item }
    let { inlineQuery, fieldsOfInterest } = copiedItem;
    inlineQuery.filters[fieldsOfInterest[1]] = apiItem.key;
    delete inlineQuery.dynamic_fields;
    copiedItem.inlineQuery = inlineQuery
    copiedItem.resultFormat = "json_detail"
    // helperFunctionMapper(null, null, copiedItem)
  }

  return (
    <ListItem
      key={validIdHelper(`TrendItem-${apiItem.key}-${apiItem.value}`)}
      display="inline"
      className={`${classes.nested} ${classes.padding5}`}
    // onClick={onClickHandler} 
    >
      { formattedText}
    </ListItem >
  )
}
