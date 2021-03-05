import React, { useState, useContext } from 'react';
import { Grid, Box } from '@material-ui/core';
import { EmbedHighlight } from "@pbl-demo/components/Accessories";
import { appContextMap, validIdHelper } from '../../utils/tools';


export default function EmbeddedDashboardContainer({ classes, lookerContent, type }) {


  const { theme } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);


  return (
    <Grid item
      sm
      className={classes.animatedGridItem}
      style={{
        transition: theme.transitions.create("all", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        })
      }}
    >
      <Box className={`${classes.w100} ${classes.padding10}`} mt={lookerContent[0].filter || lookerContent[0].dynamicFieldLookUp ? 2 : 0}>
        <EmbedHighlight classes={classes}>
          <div
            className={`embedContainer ${validIdHelper(type)}`}
            id={validIdHelper(`embedContainer-${type}-${lookerContent[0].slug || lookerContent[0].id}`)}
            key={validIdHelper(`embedContainer-${type}-${lookerContent[0].slug || lookerContent[0].id}`)}
          >
          </div>
        </EmbedHighlight>
      </Box>
    </Grid>
  )
}
