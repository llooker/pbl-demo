import React from 'react';
import { Button } from '@material-ui/core';

export function ActionButton({ item, helperFunctionMapper, classes }) {
  // console.log('ActionButton')

  return (
    <Button
      onClick={() => {
        helperFunctionMapper(item)
      }}>
      {item.label}
    </Button>
  );
}
