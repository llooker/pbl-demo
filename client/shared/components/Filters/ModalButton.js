import React from 'react';
import { Button, Tooltip } from '@material-ui/core';

export function ModalButton({ filterItem, handleRenderModal, hiddenFilterValue, classes }) {
  // console.log('ModalButton')
  // console.log({ hiddenFilterValue })
  let HighlightComponent = filterItem.highlightComponent || EmbedMethodHighlight;
  return (
    <HighlightComponent classes={classes} >
      <Tooltip title={filterItem.tooltip}>
        <span>
          <Button
            variant={"contained"}
            disabled={hiddenFilterValue == null ? true : false}
            onClick={(event) => {
              handleRenderModal({ filterItem, status: true })
            }}
            className={`${classes.mt12}`}>
            {filterItem.label}
          </Button></span>
      </Tooltip>
    </HighlightComponent>
  );
}
