import _ from 'lodash';
import React, { useState } from 'react';
import { Typography } from '@material-ui/core'
import { lifetimeRevenueTierMap, lifetimeRevenueTierIconMap } from './helpers';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { EmbedMethodHighlight } from '../Accessories/Highlight';
const { validIdHelper } = require('../../utils/tools');

export const ToggleApi = ({ apiContent, classes, action, filterItem }) => {
  // console.log("ToggleApi");
  // console.log({ filterItem })
  // console.log({ apiContent })

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
          if (ageTier[Object.keys(ageTier)[0]] !== "Undefined") {
            const Icon = lifetimeRevenueTierIconMap[ageTier[Object.keys(ageTier)[0]]];
            return (
              <ToggleButton
                key={validIdHelper(`$FilterBar-ToggleButton-${filterItem.label}-${index}`)}
                value={ageTier[Object.keys(ageTier)[0]]}
                aria-label={ageTier[Object.keys(ageTier)[0]]}
                className={classes.w33}>
                <Icon className={classes.mr12} />
                {_.capitalize(lifetimeRevenueTierMap[ageTier[Object.keys(ageTier)[0]]]) || ageTier[Object.keys(ageTier)[0]]}
              </ToggleButton>
            )
          }
        }) : ''}
      </ToggleButtonGroup>
    </EmbedMethodHighlight>
  )
}
