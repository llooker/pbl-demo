import React, { useEffect, useState } from 'react';
import { FormControl, Select, MenuItem, InputLabel, Button, Typography, Tooltip } from '@material-ui/core'
import { EmbedHighlight } from '../Accessories/Highlight';
const { validIdHelper } = require('../../utils/tools');

export const Dropdown = ({ classes, filterItem, helperFunctionMapper, hiddenFilterValue, action }) => {
  // console.log("Dropdown");
  // console.log({ filterItem })
  // console.log({ helperFunctionMapper })

  const [selectValue, setSelectValue] = useState(filterItem ? filterItem.options[0].value : "");
  const [processing, setProcessing] = useState(false)
  let HighlightComponent = filterItem.highlightComponent || EmbedHighlight;
  const { secondaryComponent } = filterItem


  return (
    <HighlightComponent classes={classes} >
      <Tooltip title={filterItem.tooltip}>
        <FormControl className={`${classes.formControl} ${classes.w90}`}>
          <InputLabel id="demo-simple-select-label"
          >{filterItem.label}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectValue}
            onChange={(event) => {
              setSelectValue(event.target.value)
              if (filterItem.method && !secondaryComponent) helperFunctionMapper(event, event.target.value, filterItem)
              else action(filterItem.filterName, event.target.value)
            }}
          // disabled={hiddenFilterValue == null ? true : false}
          >
            {filterItem.options.map(item => {
              return < MenuItem
                key={validIdHelper(`filter-select${item.value}`)}
                value={item.value} > {item.label}</MenuItem>
            })}
          </Select>
          {
            secondaryComponent ?
              <Button
                variant={"contained"}
                onClick={async () => {
                  helperFunctionMapper(null, selectValue, filterItem);
                  setProcessing(true)
                  setTimeout(() => {
                    setProcessing(false)
                  }, [6000])
                }}
                className={`${classes.mt12}`}
                disabled={(hiddenFilterValue == null || processing) ? true : false}

              >{secondaryComponent.label}</Button>
              : ""
          }
        </FormControl>
      </Tooltip>
    </HighlightComponent >
  )
}
