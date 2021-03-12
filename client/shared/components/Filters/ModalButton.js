import React from 'react';
import { Button, Tooltip } from '@material-ui/core';

export function ModalButton({ filterItem, handleRenderModal, hiddenFilterValue }) {
  // console.log('ModalButton')
  // console.log({ hiddenFilterValue })
  return (
    <Tooltip title={filterItem.tooltip}>
      <span>
        <Button
          disabled={hiddenFilterValue == null ? true : false}
          onClick={(event) => {
            handleRenderModal({ filterItem, status: true })
          }}>
          {filterItem.label}
        </Button></span>
    </Tooltip>
  );
}
