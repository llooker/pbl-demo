import React, { useEffect, useState } from 'react';
import { FormControl, Select, MenuItem, InputLabel, Button, Typography, Tooltip } from '@material-ui/core'
import { EmbedHighlight } from '../Accessories/Highlight';
const { validIdHelper } = require('../../utils/tools');

export const Dropdown = ({ classes, filterItem, helperFunctionMapper, hiddenFilterValue }) => {
  // console.log("Dropdown");
  // console.log({ filterItem })
  // console.log({ helperFunctionMapper })

  const [selectValue, setSelectValue] = useState(filterItem ? filterItem.options[0].value : "");
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  let HighlightComponent = filterItem.highlightComponent || EmbedHighlight;


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
              if (filterItem.method && !filterItem.secondaryComponent) helperFunctionMapper(event, event.target.value, filterItem)
            }}
            disabled={hiddenFilterValue == null ? true : false}
          >
            {filterItem.options.map(item => {
              return < MenuItem
                key={validIdHelper(`filter-select${item.value}`)}
                value={item.value} > {item.label}</MenuItem>
            })}
          </Select>
          {
            filterItem.secondaryComponent ?
              <Button
                variant={"contained"}
                onClick={async () => {
                  setProcessing(true);
                  let caseResponse = await helperFunctionMapper(null, selectValue, filterItem);
                  if (caseResponse.status === "success") {
                    setProcessing(false);
                    setSuccessMessage(caseResponse.message)
                    setTimeout(() => setSuccessMessage(null), 10000)
                  }

                  setTimeout(() => {
                    if (processing) setProcessing(false);
                  }, 10000)
                }}
                className={`${classes.mt12}`}
                disabled={(hiddenFilterValue == null || processing) ? true : false}

              >{filterItem.secondaryComponent.label}</Button>
              : ""
          }
          {/* needs work */}
          {successMessage ?
            <Typography variant="subtitle1" gutterBottom>
              {successMessage}
            </Typography>
            : ""}
        </FormControl>
      </Tooltip>
    </HighlightComponent >
  )
}
