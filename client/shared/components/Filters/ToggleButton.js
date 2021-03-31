import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core'
import { ToggleButton as MaterialToggleButton, ToggleButtonGroup as MaterialToggleButtonGroup } from '@material-ui/lab';
import { EmbedMethodHighlight } from '../Accessories/Highlight';
const { validIdHelper } = require('../../utils/tools');

export const ToggleButton = ({ classes, item, helperFunctionMapper }) => {
  // console.log("ToggleButton")
  // console.log({ classes })
  // console.log({ item })
  // console.log({ helperFunctionMapper })

  const [toggleValue, setToggleValue] = useState(item ? item.options[0] : "");
  let HighlightComponent = item.highlightComponent || EmbedMethodHighlight;
  console.log({ HighlightComponent })

  return (
    <HighlightComponent classes={classes} >
      <Typography
      >
        {item.label}
      </Typography>
      <MaterialToggleButtonGroup
        value={toggleValue}
        exclusive
        onChange={(event, newValue) => {
          setToggleValue(newValue)
          helperFunctionMapper({ newValue, item })
        }}
        aria-label="text alignment"
      >
        {item.options.map(innerItem => {
          return (
            <MaterialToggleButton
              key={validIdHelper(`dynamicToggleButton-${innerItem}`)}
              value={innerItem}
              aria-label="left aligned">
              {innerItem}
            </MaterialToggleButton>
          )
        })}
      </MaterialToggleButtonGroup>
    </HighlightComponent>
  )
}
