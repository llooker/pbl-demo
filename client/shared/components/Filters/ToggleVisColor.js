import _ from 'lodash';
import React from 'react';
import { Typography } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { EmbedMethodHighlight } from '../Accessories/Highlight';
const { validIdHelper } = require('../../utils/tools');


export const ToggleVisColor = ({ classes, visColorToggleValue, handleVisColorToggle, filterItem }) => {
  return (

    <EmbedMethodHighlight classes={classes} >
      <Typography
      >{filterItem.label}</Typography>
      <ToggleButtonGroup
        value={visColorToggleValue}
        exclusive
        onChange={handleVisColorToggle}
        aria-label="text alignment"
      >
        {Object.keys(filterItem.colors).map(key => {
          return (
            <ToggleButton
              key={validIdHelper(`dynamicDashVisConfigToggle-${key}`)}
              value={key} aria-label="left aligned">
              <span className={`${classes.dot}`} style={{
                backgroundColor: (filterItem.colors[key][filterItem.colors[key].length - 2]
                  || key)
              }}></span>
            </ToggleButton>
          )
        })}
      </ToggleButtonGroup>

    </EmbedMethodHighlight>
  )
}
