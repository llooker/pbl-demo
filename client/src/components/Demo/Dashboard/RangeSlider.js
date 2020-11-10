import React, { useState } from 'react';
import { Typography, Grid, Slider } from '@material-ui/core'
import { EmbedMethodHighlight } from '../../Highlights/Highlight';
const { validIdHelper } = require('../../../tools');

export default function RangeSlider({ lookerContent, apiContent, index, classes, customFilterAction, type }) {

  const [sliderValue, setSliderValue] = useState([]);

  return (
    <Grid item sm={12}>
      <EmbedMethodHighlight classes={classes}
        key={validIdHelper(`dashEmbed-${type}${lookerContent.id}-${index}`)} >
        <Typography className={`${classes.heading} ${classes.ml12}  ${classes.verticalAlignTop}`}
        >Age Range:</Typography>
        <Slider
          value={sliderValue.length ? sliderValue : Array.isArray(apiContent[index]) ? [apiContent[index][0].label, apiContent[index][apiContent[index].length - 1].label] : []}
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
          min={Array.isArray(apiContent[index]) ? apiContent[index][0].label : ''}
          max={Array.isArray(apiContent[index]) ? apiContent[index][apiContent[index].length - 1].label : ''}
          name="Age Range"
          marks={Array.isArray(apiContent[index]) ? [{ value: apiContent[index][0].label, label: apiContent[index][0].label }, { value: apiContent[index][apiContent[index].length - 1].label, label: apiContent[index][apiContent[index].length - 1].label }] : ''}
          disabled={Array.isArray(apiContent[index]) ? false : true}
        />
      </EmbedMethodHighlight>
    </Grid>
  )
}
