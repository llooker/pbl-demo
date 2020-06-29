import React, { useContext } from 'react';
import AppContext from '../AppContext';
import { Box, Typography, Grid } from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { API_COLOR, EMBED_COLOR } from './Highlights/Highlight';
export function HighlightSourcesLegend( {className}) {
  
  const {show} = useContext(AppContext)
  console.log(className)
  if (show) {
    return (
      <Box 
        className={className}
      >
        <Grid container direction="column">
          <Grid item>
            
            <Typography variant="subtitle1" ><CheckBoxOutlineBlankIcon style={{ color: API_COLOR }}/> API</Typography>
          </Grid>
          <Grid>
            <Typography variant="subtitle1" ><CheckBoxOutlineBlankIcon style={{ color: EMBED_COLOR }} /> Embed</Typography>
          </Grid>
        </Grid>
      </Box>
    )
  } else {
    return (
      <></>
    );
  }
}
