import _ from 'lodash';
import React from 'react';
import { Typography } from '@material-ui/core'
import { EmbedMethodHighlight } from '../../Highlights/Highlight';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
const { validIdHelper } = require('../../../tools');


export default function ToggleTile({ lookerContent, classes, tileToggleValue, handleTileToggle }) {
  return (

    <EmbedMethodHighlight classes={classes} >
      <Typography
      >
        Dynamic Tiles:        </Typography>
      <ToggleButtonGroup
        value={tileToggleValue}
        exclusive
        onChange={handleTileToggle}
        aria-label="text alignment"
      >
        {Object.keys(lookerContent[0].dynamicFieldLookUp).map(key => {
          return (
            <ToggleButton
              key={validIdHelper(`dynamicDashTileToggle-${key}`)}
              value={key} aria-label="left aligned">
              {key}
            </ToggleButton>
          )
        })}
      </ToggleButtonGroup>
    </EmbedMethodHighlight>

  )
}
