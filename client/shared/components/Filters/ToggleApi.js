import _ from 'lodash';
import React, { useState } from 'react';
import { Typography } from '@material-ui/core'
import { lifetimeRevenueTierMap, lifetimeRevenueTierIconMap } from './helpers';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { EmbedMethodHighlight } from '../Accessories/Highlight';
const { validIdHelper } = require('../../utils/tools');

export const ToggleApi = ({ apiContent, classes, action, filterItem }) => {

  const [lifetimeRevenueTierValue, setLifetimeRevenueTierValue] = useState('0-24');
  return (
    <EmbedMethodHighlight classes={classes}
      key={validIdHelper(`dashEmbed-${filterItem.label}`)} >
      <Typography className={`${classes.heading} ${classes.ml12}  ${classes.verticalAlignTop}`}
      >
        {filterItem.label}:
        </Typography>
      <ToggleButtonGroup
        value={lifetimeRevenueTierValue}
        exclusive //for now
        onChange={(event, newValue) => {
          setLifetimeRevenueTierValue(newValue)
          action(
            filterItem.filterName,
            (newValue) ? newValue : '')
        }}
        aria-label="ageTier"
        className={classes.w100}>
        {Array.isArray(apiContent) ? apiContent.map((ageTier, index) => {
          if (ageTier.label !== "Undefined") {
            const Icon = lifetimeRevenueTierIconMap[ageTier.label];
            return (
              <ToggleButton
                key={validIdHelper(`$FilterBar-ToggleButton-${filterItem.label}-${index}`)}
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
