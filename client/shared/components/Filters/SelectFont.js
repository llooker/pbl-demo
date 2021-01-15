import React from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@material-ui/core'
import { EmbedHighlight } from '../Accessories/Highlight';
const { validIdHelper } = require('../../utils/tools');


export const SelectFont = ({ classes, fontThemeSelectValue, handleThemeChange, filterItem }) => {
  return (
    <EmbedHighlight classes={classes} >
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label"
        >{filterItem.label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={fontThemeSelectValue}
          onChange={(event) => {
            handleThemeChange(null, event.target.value)
          }}
        >
          {filterItem.options.map(item => {
            return < MenuItem
              key={validIdHelper(`filter-select${item}`)}
              value={item.toLowerCase()} > {item}</MenuItem>
          })}
        </Select>
      </FormControl>

    </EmbedHighlight >
  )
}
