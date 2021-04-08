import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core'
import { ToggleButton as MaterialToggleButton, ToggleButtonGroup as MaterialToggleButtonGroup } from '@material-ui/lab';
import { EmbedMethodHighlight } from '../Accessories/Highlight';
const { validIdHelper } = require('../../utils/tools');

export const ToggleButton = ({ classes, filterItem, helperFunctionMapper }) => {
  // console.log("ToggleButton")
  // console.log({ classes })
  // console.log({ filterItem })
  // console.log({ helperFunctionMapper })

  const [toggleValue, setToggleValue] = useState(filterItem ? filterItem.options[0] : "");
  let HighlightComponent = filterItem.highlightComponent || EmbedMethodHighlight;

  return (
    <HighlightComponent classes={classes} >
      <Typography
      >
        {filterItem.label}
      </Typography>
      <MaterialToggleButtonGroup
        value={toggleValue}
        exclusive
        onChange={(event, newValue) => {
          setToggleValue(newValue)
          helperFunctionMapper({ newValue, filterItem })
        }}
        aria-label="text alignment"
      >
        {filterItem.options.map(innerItem => {
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
