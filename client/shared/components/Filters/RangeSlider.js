import React, { useState } from 'react';
import { Typography, Slider } from '@material-ui/core'
import { EmbedMethodHighlight } from '../Accessories/Highlight';
const { validIdHelper } = require('../../utils/tools');


export const RangeSlider = ({ apiContent, classes, action, filterItem }) => {
  // console.log("RangeSlider");
  // console.log({ filterItem })
  // console.log({ apiContent })

  const [sliderValue, setSliderValue] = useState([]);


  return (
    <EmbedMethodHighlight classes={classes}
      key={validIdHelper(`dashEmbed-${filterItem.label}`)} >
      <Typography className={`${classes.heading} ${classes.ml12}  ${classes.verticalAlignTop}`}>
        {filterItem.label}:
        </Typography>
      <Slider
        value={sliderValue.length ? sliderValue : Array.isArray(apiContent) ? [apiContent[0][Object.keys(apiContent[0])[0]], apiContent[apiContent.length - 1][Object.keys(apiContent[0])[0]]] : []}
        onChange={(event, newValue) => {
          setSliderValue(newValue);
        }}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        onChangeCommitted={(event, newValue) => {
          action(
            filterItem.filterName,
            (newValue) ? `[${newValue}]` : '[]')
        }}
        min={Array.isArray(apiContent) && apiContent.length ? apiContent[0][Object.keys(apiContent[0])[0]] : 0}
        max={Array.isArray(apiContent) && apiContent.length ? apiContent[apiContent.length - 1][Object.keys(apiContent.lenth - 1)[0]] : 0}
        disabled={Array.isArray(apiContent) && apiContent.length ? false : true}
      />
    </EmbedMethodHighlight>
  )
}
