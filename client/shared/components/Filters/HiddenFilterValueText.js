import React from 'react';
import { Typography, Grid } from '@material-ui/core';

export function HiddenFilterValueText({ filterItem, handleRenderModal, hiddenFilterValue, classes, container }) {

  let HighlightComponent = filterItem.highlightComponent || EmbedMethodHighlight;
  return (
    <HighlightComponent classes={classes} >
      <Typography variant="h6" className={classes.marginLR10}>
        {filterItem.label}: {hiddenFilterValue}
      </Typography>
    </HighlightComponent>
  );
}
