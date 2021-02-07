import _ from 'lodash';
import React from 'react';
import { Typography, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { ApiHighlight } from '../Accessories/Highlight';
import { NumberToColoredPercent } from '../Accessories/NumberToColoredPercent';

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

const { validIdHelper } = require('../../utils/tools');

export const AutoComplete = ({ filterItem, apiContent, classes, action, bgColor, setDynamicSearch }) => {
  // console.log("AutoComplete");
  // console.log({ filterItem })
  // console.log({ apiContent })

  return (
    filterItem ?
      <ApiHighlight
        key={validIdHelper(`dashEmbed-${filterItem.label}`)}
        classes={classes} >
        <Typography>
          {filterItem.label ? filterItem.label : ""}
        </Typography>
        <Autocomplete
          id={`combo-box-dashboard-${filterItem.label}`}
          options={Array.isArray(apiContent) ?
            apiContent :
            []}
          renderOption={handleRenderOption} // highlighter
          getOptionLabel={option => typeof option === 'string' ? option : option.label}
          onChange={(event, newValue) => {
            let newValueToUse = '';
            if (newValue && newValue.value) newValueToUse = newValue.value
            else if (newValue && newValue.label) newValueToUse = newValue.label
            action(
              filterItem.filterName,
              newValueToUse)
          }}
          renderInput={(params) => <TextField {...params}
            label={filterItem.alternateName ? filterItem.alternateName : filterItem.filterName}
            variant="outlined"
          />}
          loadingText="Loading..."
          style={{
            backgroundColor: bgColor || ""
          }}
          onInputChange={_.debounce((event) => {
            if (filterItem.apiDrivenSearch && event.target.value) setDynamicSearch(event.target.value)
          }, 1000)}

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