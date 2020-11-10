import _ from 'lodash';
import React, { useState } from 'react';
import { Typography, Grid } from '@material-ui/core'
import { EmbedMethodHighlight } from '../../Highlights/Highlight';
import { lifetimeRevenueTierMap, lifetimeRevenueTierIconMap } from './helpers';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
const { validIdHelper } = require('../../../tools');

export default function Toggle({ lookerContent, apiContent, index, classes, customFilterAction, type }) {

  const [lifetimeRevenueTierValue, setLifetimeRevenueTierValue] = useState('0-24');


  return (

    <Grid item sm={12}>
      <EmbedMethodHighlight classes={classes}
        key={validIdHelper(`dashEmbed-${type}${lookerContent.id}-${index}`)} >
        <Typography className={`${classes.heading} ${classes.ml12}  ${classes.verticalAlignTop}`}
        >Lifetime Revenue Tier:</Typography>
        <ToggleButtonGroup
          value={lifetimeRevenueTierValue}
          exclusive //for now
          onChange={(event, newValue) => {
            setLifetimeRevenueTierValue(newValue)
            customFilterAction(lookerContent[0].id,
              lookerContent[0].filters[index + 1].filterName,
              (newValue) ? newValue : '')
          }}
          aria-label="ageTier"
          className={classes.w100}>
          >
      {apiContent[index + 1].map((ageTier, index) => {
            if (ageTier.label !== "Undefined") {
              const Icon = lifetimeRevenueTierIconMap[ageTier.label];
              return (
                <ToggleButton
                  key={validIdHelper(`${type}-FilterBar-ToggleButton-${lookerContent[0].id}-${index}`)}
                  value={ageTier.label}
                  aria-label={ageTier.label}
                  className={classes.w33}>
                  <Icon className={classes.mr12} />
                  {_.capitalize(lifetimeRevenueTierMap[ageTier.label]) || ageTier.label}
                </ToggleButton>
              )
            }
          })}
        </ToggleButtonGroup>

      </EmbedMethodHighlight>
    </Grid>
  )
}
