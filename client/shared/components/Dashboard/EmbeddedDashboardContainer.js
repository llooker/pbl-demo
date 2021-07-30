import React, { useState, useContext } from 'react';
import { Grid, Box } from '@material-ui/core';
import { EmbedHighlight } from "@pbl-demo/components/Accessories";
import { appContextMap, validIdHelper } from '../../utils/tools';


export default function EmbeddedDashboardContainer({ classes, lookerContent, type, }) {

  // console.log("EmbeddedDashboardContainer")

  const { theme } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);


  return (
    <Grid item
      sm
    >
      <Box className={`${classes.w100}`} >
        <EmbedHighlight classes={classes}>
          <div
            className={`embedContainer ${validIdHelper(type)} `}
            id={validIdHelper(`embedContainer-${type}-${lookerContent[0].slug || lookerContent[0].id}`)}
            key={validIdHelper(`embedContainer-${type}-${lookerContent[0].slug || lookerContent[0].id}`)}
          // style={{ height }}
          >
          </div>
        </EmbedHighlight>
      </Box>
    </Grid >
  )
}
