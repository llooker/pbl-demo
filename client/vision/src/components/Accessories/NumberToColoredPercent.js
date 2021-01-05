import React from 'react';
import { TextField } from '@material-ui/core';

export function NumberToColoredPercent( {val, positive_good, abs_val}) {
  const colors = {
    up: (positive_good) ? 'green' : 'red',
    down: (positive_good) ? 'red' : 'green'
  }
  const color = (val<0) ? colors.down : (val>0) ? colors.up : 'black'
  const val_formatted = Math.abs(val).toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })
  const icon = (val<0) ? '▼' : (val>0) ? '▲' : '—'
  
  return (<>
      <font
        color={color}
      >
        {`${icon} ${val_formatted}`}
      </font>
  </>
  )
}