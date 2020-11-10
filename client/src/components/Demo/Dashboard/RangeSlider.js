import React, { useState } from 'react';
import { Typography, Grid, Slider } from '@material-ui/core'
import { EmbedMethodHighlight } from '../../Highlights/Highlight';
const { validIdHelper } = require('../../../tools');

export default function RangeSlider({ lookerContent, apiContent, index, classes, customFilterAction, type, horizontalLayout }) {

  const [sliderValue, setSliderValue] = useState([]);

  return (
    <Grid item sm={horizontalLayout ? 3 : 12}>
      <EmbedMethodHighlight classes={classes}
        key={validIdHelper(`dashEmbed-${type}${lookerContent.id}-${index}`)} >
        <Typography className={`${classes.heading} ${classes.ml12}  ${classes.verticalAlignTop}`}>
          {lookerContent[0].filters[index].label}:
        </Typography>
        <Slider
          value={sliderValue.length ? sliderValue : Array.isArray(apiContent) ? [apiContent[0].label, apiContent[apiContent.length - 1].label] : []}
          onChange={(event, newValue) => {
            setSliderValue(newValue);
          }}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          onChangeCommitted={(event, newValue) => {
            customFilterAction(lookerContent[0].id,
              lookerContent[0].filters[index].filterName,
              (newValue) ? `[${newValue}]` : '[]')
          }}
          min={Array.isArray(apiContent) && apiContent.length ? apiContent[0].label : 0}
          max={Array.isArray(apiContent) && apiContent.length ? apiContent[apiContent.length - 1].label : 0}
          marks={Array.isArray(apiContent) && apiContent.length ? [{ value: apiContent[0].label, label: apiContent[0].label }, { value: apiContent[apiContent.length - 1].label, label: apiContent[apiContent.length - 1].label }] : ''}
          disabled={Array.isArray(apiContent) && apiContent.length ? false : true}
        />
      </EmbedMethodHighlight>
    </Grid>
  )
}
