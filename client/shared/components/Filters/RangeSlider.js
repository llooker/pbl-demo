import React, { useState } from 'react';
import { Typography, Slider } from '@material-ui/core'
import { EmbedMethodHighlight } from '../Accessories/Highlight';
const { validIdHelper } = require('../../utils/tools');


export const RangeSlider = ({ apiContent, classes, action, filterItem }) => {

  const [sliderValue, setSliderValue] = useState([]);

  return (
    <EmbedMethodHighlight classes={classes}
      key={validIdHelper(`dashEmbed-${filterItem.label}`)} >
      <Typography className={`${classes.heading} ${classes.ml12}  ${classes.verticalAlignTop}`}>
        {filterItem.label}:
        </Typography>
      <Slider
        value={sliderValue.length ? sliderValue : Array.isArray(apiContent) ? [apiContent[0].label, apiContent[apiContent.length - 1].label] : []}
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
        min={Array.isArray(apiContent) && apiContent.length ? apiContent[0].label : 0}
        max={Array.isArray(apiContent) && apiContent.length ? apiContent[apiContent.length - 1].label : 0}
        disabled={Array.isArray(apiContent) && apiContent.length ? false : true}
      />
    </EmbedMethodHighlight>
  )
}
