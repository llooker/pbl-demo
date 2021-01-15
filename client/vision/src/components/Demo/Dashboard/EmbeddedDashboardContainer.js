import React from 'react'
import { Grid, Box } from '@material-ui/core';
import { EmbedHighlight } from "@pbl-demo/components/Accessories";

const { validIdHelper } = require('../../../tools');

export default function EmbeddedDashboardContainer({ classes, lookerContent, type, width }) {
  return (
    <Grid item
      sm={width}
    >
      <Box className={`${classes.w100} ${classes.padding10}`} mt={lookerContent[0].filter || lookerContent[0].dynamicFieldLookUp ? 2 : 0}>
        <EmbedHighlight classes={classes}>
          <div
            className={`embedContainer ${validIdHelper(type)}`}
            id={validIdHelper(`embedContainer-${type}-${lookerContent[0].id}`)}
            key={validIdHelper(`embedContainer-${type}-${lookerContent[0].id}`)}
          >
          </div>
        </EmbedHighlight>
      </Box>
    </Grid>
  )
}
