import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { EmbedMethodHighlight } from '../Accessories/Highlight';
const { validIdHelper } = require('../../utils/tools');


export const ToggleTile = ({ classes, filterItem, helperFunctionMapper, lightThemeToggleValue, fontThemeSelectValue }) => {
  // console.log("ToggleTile")
  // console.log({ classes })
  // console.log({ filterItem })
  // console.log({ helperFunctionMapper })

  const [tileToggleValue, setTileToggleValue] = useState(filterItem ? filterItem.options[0] : "");

  useEffect(() => {
    setTileToggleValue(filterItem ? filterItem.options[0] : "")
  }, [fontThemeSelectValue, lightThemeToggleValue])
  return (
    <EmbedMethodHighlight classes={classes} >
      <Typography
      >
        {filterItem.label}
      </Typography>
      <ToggleButtonGroup
        value={tileToggleValue}
        exclusive
        onChange={(event, newValue) => {
          setTileToggleValue(newValue)
          helperFunctionMapper(event, newValue, filterItem)
        }}
        aria-label="text alignment"
      >
        {Object.keys(filterItem.tileLookUp).map(key => {
          return (
            <ToggleButton
              key={validIdHelper(`dynamicDashTileToggle-${key}`)}
              value={key}
              aria-label="left aligned">
              {key}
            </ToggleButton>
          )
        })}
      </ToggleButtonGroup>
    </EmbedMethodHighlight>
  )
}
