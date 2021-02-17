import React, { useState } from 'react';
import { Typography } from '@material-ui/core'
import { CheckboxSVGMap } from "./CheckboxSvgMapRegion";
import { customUsa } from './helpers';
import { EmbedMethodHighlight } from '../Accessories/Highlight';
const { validIdHelper } = require('../../utils/tools');


export function MapFilter({ classes, action, filterItem }) {

  const [regionValue, setRegionValue] = useState('Pacific, South, Mountain, Midwest, Northeast');

  return (
    <EmbedMethodHighlight classes={classes}
      key={validIdHelper(`dashEmbed-${filterItem.label}`)} >
      <Typography className={`${classes.heading} ${classes.ml12}  ${classes.verticalAlignTop}`}
      >
        {filterItem.label}: <b>{regionValue ? regionValue : "Outside US"}</b>
      </Typography>

      <CheckboxSVGMap map={customUsa}
        onChange={(locations) => {

          let allUniqueRegionsFromSelectedLocations = [];
          for (let j = 0; j < locations.length; j++) {
            if (allUniqueRegionsFromSelectedLocations.indexOf(locations[j].region) == -1) {
              allUniqueRegionsFromSelectedLocations.push(locations[j].region)
            }
          }
          let allUniqueRegionsFromSelectedLocationsCommaSep = allUniqueRegionsFromSelectedLocations.join(",")
          setRegionValue(allUniqueRegionsFromSelectedLocationsCommaSep)
          action(
            filterItem.filterName,
            (regionValue) ? regionValue : '')
        }}
      />
    </EmbedMethodHighlight>
  )
}
