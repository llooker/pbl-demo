import _, { filter } from 'lodash';
import React, { useState, useEffect } from 'react';
import { Typography, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { ApiHighlight } from '../Accessories/Highlight';
import { NumberToColoredPercent } from '../Accessories';
import SearchIcon from '@material-ui/icons/Search';

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

const { validIdHelper } = require('../../utils/tools');

export const AutoComplete = ({ filterItem, apiContent, classes, action, setDynamicSearch }) => {
  // console.log("AutoComplete");
  // console.log({ filterItem })
  // console.log({ apiContent })
  // console.log({ action })

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(null);

  //https://medium.com/@anuhosad/debouncing-events-with-react-b8c405c33273
  const onInputChange = (event) => {
    /* signal to React not to nullify the event object */
    event.persist();

    const debouncedFn = _.debounce(() => {
      if (event.target.value) setDynamicSearch(event.target.value)

    }, 1000);

    debouncedFn();
  }

  return (
    filterItem ?
      <ApiHighlight
        key={validIdHelper(`dashEmbed-${filterItem.label}`)}
        classes={classes} >
        <Typography>
          {filterItem.label ? filterItem.label : ""}
        </Typography>
        <Autocomplete
          id={`combo-box-dashboard-${filterItem.label || filterItem.alternateName}`}
          options={Array.isArray(apiContent) ?
            apiContent :
            []}
          renderOption={handleRenderOption} // highlighter
          getOptionLabel={option => typeof option === 'string' ? option : option.label}
          //for normal customFilterAction
          onChange={(event, newValue) => {
            let newValueToUse = '';
            if (newValue && newValue.value) newValueToUse = newValue.value
            else if (newValue && newValue.label) newValueToUse = newValue.label
            action(
              filterItem.filterName,
              newValueToUse)
            setValue(newValue && newValue.label ? newValue.label : null)
          }}
          renderInput={(params) =>
            < TextField
              {...params}
              label={open || value ? "" : filterItem.alternateName ?
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}><SearchIcon />
                  {filterItem.alternateName}</div> :
                filterItem.filterName
              }
              InputLabelProps={filterItem.disableShrink ? { shrink: false } : {}}
              variant="outlined"
            />
          }
          loadingText="Loading..."
          style={filterItem.style ? { ...filterItem.style } : {}}
          size={filterItem.size ? filterItem.size : "medium"}
          onOpen={() => { setOpen(true) }}
          onClose={() => { setOpen(false) }}
          value={value}
          //for dynamicSearch
          onInputChange={filterItem.apiDrivenSearch ? onInputChange : null}
        />
      </ApiHighlight> : ""
  )
}

const handleRenderOption = (option, { inputValue }) => {
  const matches = match(option.label, inputValue);
  const parts = parse(option.label, matches);

  const highlightStyle = {
    fontWeight: 700,
    backgroundColor: "lightyellow",
    padding: "5px 2px"
  };

  return (
    <div>
      {parts.map((part, index) => (
        <span key={index} style={part.highlight ? highlightStyle : {}}>
          {part.text}
        </span>
      ))}
      {option.trend &&
        <NumberToColoredPercent
          val={option.trend}
          positive_good={true}
          abs_val={Math.abs(option.trend)}
        />
      }
    </div>
  );
};

export default handleRenderOption;