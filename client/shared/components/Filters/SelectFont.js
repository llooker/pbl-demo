import React, { useEffect, useState } from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@material-ui/core'
import { EmbedHighlight } from '../Accessories/Highlight';
const { validIdHelper } = require('../../utils/tools');


export const SelectFont = ({ classes, filterItem, helperFunctionMapper }) => {
  // console.log("SelectFont");
  // console.log({ filterItem })
  // console.log({ helperFunctionMapper })

  const [fontThemeSelectValue, setFontThemeSelectValue] = useState(filterItem ? filterItem.options[0].toLowerCase() : "");

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
            setFontThemeSelectValue(event.target.value)
            helperFunctionMapper(event, event.target.value, filterItem)
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
