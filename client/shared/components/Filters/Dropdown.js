import React, { useEffect, useState } from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@material-ui/core'
import { EmbedHighlight } from '../Accessories/Highlight';
const { validIdHelper } = require('../../utils/tools');


export const Dropdown = ({ classes, filterItem, helperFunctionMapper }) => {
  console.log("Dropdown");
  console.log({ filterItem })
  console.log({ helperFunctionMapper })

  const [selectValue, setSelectValue] = useState(filterItem ? filterItem.options[0].value : "");

  console.log({ selectValue })

  return (
    <EmbedHighlight classes={classes} >
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label"
        >{filterItem.label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectValue}
          onChange={(event) => {
            setSelectValue(event.target.value)
            helperFunctionMapper(event, event.target.value, filterItem)
          }}
        >
          {filterItem.options.map(item => {
            return < MenuItem
              key={validIdHelper(`filter-select${item.value}`)}
              value={item.value} > {item.label}</MenuItem>
          })}
        </Select>
      </FormControl>
    </EmbedHighlight >
  )
}
