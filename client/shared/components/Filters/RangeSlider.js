import React, { useState } from 'react';
import { Typography, Slider } from '@material-ui/core'
import { EmbedMethodHighlight } from '../Accessories/Highlight';
import { filter } from 'lodash';
const { validIdHelper } = require('../../utils/tools');


export const RangeSlider = ({ apiContent, classes, action, filterItem }) => {
  // console.log("RangeSlider");
  // console.log({ filterItem })
  // console.log({ apiContent })

  if (!apiContent) apiContent = filterItem.options; //hack for now :D

  let HighlightComponent = filterItem.highlightComponent || EmbedMethodHighlight;

  const [sliderValue, setSliderValue] = useState([]);
  const firstApiEntry = apiContent[0]
  const lastApiEntry = apiContent[apiContent.length - 1]

  let fields;
  if (filterItem.inlineQuery && filterItem.inlineQuery.fields) fields = filterItem.inlineQuery.fields
  else fields = [Object.keys(firstApiEntry)[0]]

  return (
    <HighlightComponent classes={classes} >
      <Typography className={`${classes.heading} ${classes.ml12}  ${classes.verticalAlignTop}`}>
        {filterItem.label}:
        </Typography>
      <Slider
        value={sliderValue.length ? sliderValue : Array.isArray(apiContent) ? [apiContent[0][Object.keys(apiContent[0])[0]], apiContent[apiContent.length - 1][Object.keys(apiContent[0])[0]]] : []}
        onChange={(event, newValue) => {
          let valueToUse = newValue;
          if (filterItem.filterName === "Previous Annual Income") valueToUse = [newValue[0] * 1000, newValue[1] * 1000];
          setSliderValue(newValue);
        }}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        onChangeCommitted={(event, newValue) => {
          let valueToUse = newValue;
          if (filterItem.filterName === "Previous Annual Income") valueToUse = [newValue[0] * 1000, newValue[1] * 1000];
          action(
            filterItem.filterName,
            (valueToUse) ? `[${valueToUse}]` : '[]')
        }}
        min={Array.isArray(apiContent) && apiContent.length ? firstApiEntry[fields[0]] : 0}
        max={Array.isArray(apiContent) && apiContent.length ? lastApiEntry[fields[0]] : 0}
        disabled={Array.isArray(apiContent) && apiContent.length ? false : true}
      // marks={filterItem.showMarks ? apiContent : []} //wip
      />
    </HighlightComponent>
  )
}
