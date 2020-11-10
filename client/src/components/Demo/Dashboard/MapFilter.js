import React from 'react';
import { Typography, Grid } from '@material-ui/core'
import { EmbedMethodHighlight } from '../../Highlights/Highlight';
import { CheckboxSVGMap } from "./CheckboxSvgMapRegion";
import { customUsa } from './helpers';
const { validIdHelper } = require('../../../tools');

export default function MapFilter({ lookerContent, apiContent, index, classes, customFilterAction, type, regionValue, setRegionValue }) {
  return (
    <Grid item sm={4} >
      <EmbedMethodHighlight classes={classes}
        key={validIdHelper(`dashEmbed-${type}${lookerContent.id}-${index}`)} >
        <Typography className={`${classes.heading} ${classes.ml12}  ${classes.verticalAlignTop}`}
        >Region(s): <b>{regionValue ? regionValue : "Outside US"}</b></Typography>

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
            customFilterAction(lookerContent[0].id,
              lookerContent[0].filters[index].filterName,
              (regionValue) ? regionValue : '')
          }}
        />
      </EmbedMethodHighlight>
    </Grid>
  )
}
