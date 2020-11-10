import _ from 'lodash';
import React from 'react';
import { Typography, Grid } from '@material-ui/core'
import { EmbedMethodHighlight } from '../../Highlights/Highlight';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
const { validIdHelper } = require('../../../tools');


export default function ToggleVisColor({ lookerContent, classes, type, visColorToggleValue, handleVisColorToggle }) {
  return (

    <Grid item sm={2}>
      <EmbedMethodHighlight classes={classes} >
        <Typography
        >Dynamic Vis Color:</Typography>
        <ToggleButtonGroup
          value={visColorToggleValue}
          exclusive
          onChange={handleVisColorToggle}
          aria-label="text alignment"
        >
          {Object.keys(lookerContent[0].dynamicVisConfig.colors).map(key => {
            return (
              <ToggleButton
                key={validIdHelper(`dynamicDashVisConfigToggle-${key}`)}
                value={key} aria-label="left aligned">
                <span className={`${classes.dot}`} style={{
                  backgroundColor: (lookerContent[0].dynamicVisConfig.colors[key][lookerContent[0].dynamicVisConfig.colors[key].length - 1]
                    || key)
                }}></span>
              </ToggleButton>
            )
          })}
        </ToggleButtonGroup>

      </EmbedMethodHighlight>
    </Grid>
  )
}
