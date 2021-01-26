import React from 'react';
import { Typography, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { ApiHighlight } from '../Accessories/Highlight';
import { NumberToColoredPercent } from '../Accessories/NumberToColoredPercent';
const { validIdHelper } = require('../../utils/tools');

export const AutoComplete = ({ filterItem, apiContent, classes, action, bgColor }) => {
  // console.log("AutoComplete");
  return (
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
        renderOption={(option) => (
          <Grid container justify="space-between">
            <Grid item >
              {option.label}
            </Grid>
            {option.trend && <Grid item>
              <NumberToColoredPercent
                val={option.trend}
                positive_good={true}
                abs_val={Math.abs(option.trend)}
              />
            </Grid>}
          </Grid>
        )}
        getOptionLabel={(option) => option.label}
        onChange={(event, newValue) => {
          action(
            filterItem.filterName,
            newValue.value ? newValue.value : newValue.label ? newValue.label : "")
        }}
        renderInput={(params) => <TextField {...params}
          label={filterItem.filterName}
          variant="outlined"
        // type={"search"}
        />}
        loadingText="Loading..."
        style={{
          backgroundColor: bgColor || ""
        }}
      />
    </ApiHighlight>
  )
}