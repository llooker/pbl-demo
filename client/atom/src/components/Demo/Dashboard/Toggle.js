import _ from 'lodash';
import React, { useState } from 'react';
import { Typography, Grid } from '@material-ui/core'
import { lifetimeRevenueTierMap, lifetimeRevenueTierIconMap } from './helpers';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { EmbedMethodHighlight } from "@pbl-demo/components";

const { validIdHelper } = require('../../../tools');

export default function Toggle({ lookerContent,
  // apiContent,
  index, classes,
  type,
  value,
  onChange }) {


  return (
    <Grid item sm={3}>
      <EmbedMethodHighlight classes={classes}
        key={validIdHelper(`dashEmbed-${type}${lookerContent.id}-${index}`)} >
        <Typography className={`${classes.heading} ${classes.ml12}  ${classes.verticalAlignTop}`}
        >
          {lookerContent[0].filters[index].label}:
        </Typography>
        <ToggleButtonGroup
          value={value}
          exclusive //for now
          onChange={onChange}
          // aria-label="ageTier"
          className={classes.w100}>
          >
          {lookerContent[0].filters[index].options.map((option, index) => {
            return (
              <ToggleButton
                key={validIdHelper(`dashEmbed-${type}${lookerContent.id}-${index}`)}
                value={value}
                aria-label="left aligned">
                {option}
                {/* {validIdHelper(lookerContent[0].filters[index].label) === "DynamicVisConfig" ?
                  <span className={`${classes.dot}`} style={{
                    backgroundColor: (lookerContent[0].dynamicVisConfig.colors[key][lookerContent[0].dynamicVisConfig.colors[key].length - 1]
                      || key)
                  }}></span>
                  : option} */}
              </ToggleButton>
            )
          })}
        </ToggleButtonGroup>

      </EmbedMethodHighlight>
    </Grid>
  )
}
