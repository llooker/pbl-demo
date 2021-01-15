import _ from 'lodash';
import React, { useState } from 'react';
import { Typography } from '@material-ui/core'
import { EmbedMethodHighlight } from '../../Highlights/Highlight';
import { lifetimeRevenueTierMap, lifetimeRevenueTierIconMap } from './helpers';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
const { validIdHelper } = require('../../../tools');

export default function ToggleApi({ lookerContent, apiContent, index, classes, action }) {

  const [lifetimeRevenueTierValue, setLifetimeRevenueTierValue] = useState('0-24');
  return (
    <EmbedMethodHighlight classes={classes}
      key={validIdHelper(`dashEmbed-${lookerContent.id}-${index}`)} >
      <Typography className={`${classes.heading} ${classes.ml12}  ${classes.verticalAlignTop}`}
      >
        {lookerContent[0].filters[index].label}:
        </Typography>
      <ToggleButtonGroup
        value={lifetimeRevenueTierValue}
        exclusive //for now
        onChange={(event, newValue) => {
          setLifetimeRevenueTierValue(newValue)
          action(lookerContent[0].id,
            lookerContent[0].filters[index].filterName,
            (newValue) ? newValue : '')
        }}
        aria-label="ageTier"
        className={classes.w100}>
        {Array.isArray(apiContent) ? apiContent.map((ageTier, index) => {
          if (ageTier.label !== "Undefined") {
            const Icon = lifetimeRevenueTierIconMap[ageTier.label];
            return (
              <ToggleButton
                key={validIdHelper(`$FilterBar-ToggleButton-${lookerContent[0].id}-${index}`)}
                value={ageTier.label}
                aria-label={ageTier.label}
                className={classes.w33}>
                <Icon className={classes.mr12} />
                {_.capitalize(lifetimeRevenueTierMap[ageTier.label]) || ageTier.label}
              </ToggleButton>
            )
          }
        }) : ''}
      </ToggleButtonGroup>
    </EmbedMethodHighlight>
  )
}
