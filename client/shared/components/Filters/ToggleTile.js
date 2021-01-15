import _ from 'lodash';
import React from 'react';
import { Typography } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { EmbedMethodHighlight } from '../Accessories/Highlight';
const { validIdHelper } = require('../../utils/tools');


export const ToggleTile = ({ classes, tileToggleValue, handleTileToggle, filterItem }) => {
  return (

    <EmbedMethodHighlight classes={classes} >
      <Typography
      >
        {filterItem.label}
      </Typography>
      <ToggleButtonGroup
        value={tileToggleValue}
        exclusive
        onChange={handleTileToggle}
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
