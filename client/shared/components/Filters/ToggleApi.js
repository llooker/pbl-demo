import _ from 'lodash';
import React, { useState } from 'react';
import { Typography } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { EmbedMethodHighlight } from '../Accessories/Highlight';
const { validIdHelper } = require('../../utils/tools');

export const ToggleApi = ({ apiContent, classes, action, filterItem }) => {
  // console.log("ToggleApi");
  // console.log({ filterItem })
  // console.log({ apiContent })

  const [selectedTier, setSelectedTier] = useState(apiContent[0]);

  const firstApiEntry = apiContent[0]
  const lastApiEntry = apiContent[apiContent.length - 1]
  let fields;
  if (filterItem.inlineQuery && filterItem.inlineQuery.fields) fields = filterItem.inlineQuery.fields
  else fields = [Object.keys(firstApiEntry)[0]]
  let HighlightComponent = filterItem.highlightComponent || EmbedMethodHighlight;

  return (
    <HighlightComponent classes={classes}
      key={validIdHelper(`dashEmbed-${filterItem.label}`)} >
      <Typography className={`${classes.heading} ${classes.ml12}  ${classes.verticalAlignTop}`}
      >
        {filterItem.label}:
        </Typography>
      <ToggleButtonGroup
        value={selectedTier}
        exclusive //for now
        onChange={(event, newValue) => {
          setSelectedTier(newValue)
          action(
            filterItem.filterName,
            (newValue) ? newValue : '')
        }}
        aria-label="tier"
        className={classes.w100}>
        {Array.isArray(apiContent) ? apiContent.map((item, index) => {
          if (item[fields[0]] !== "Undefined") {
            let valueToUse = item[fields[0]];
            let labelToUse = filterItem.options ?
              filterItem.options[valueToUse]
              : valueToUse
            return (
              <ToggleButton
                key={validIdHelper(`$FilterBar-ToggleButton - ${filterItem.label} -${index} `)}
                value={valueToUse}
                aria-label={valueToUse}
                className={classes.w33}>
                {labelToUse}
              </ToggleButton>
            )
          }
        }) : ''}
      </ToggleButtonGroup>
    </HighlightComponent >
  )
}
