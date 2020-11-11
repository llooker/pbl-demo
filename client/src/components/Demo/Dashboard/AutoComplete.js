import React from 'react';
import { Typography, Grid, TextField } from '@material-ui/core'
import { ApiHighlight } from '../../Highlights/Highlight';
import { NumberToColoredPercent } from '../../Accessories/NumberToColoredPercent';
import { Autocomplete } from '@material-ui/lab'

const { validIdHelper } = require('../../../tools');


export default function AutoComplete({ lookerContent, apiContent, index, classes, customFilterAction, type, horizontalLayout }) {
  return (
    <Grid
      key={validIdHelper(`dashEmbed-${type}${lookerContent.id}-${index}`)}
      item sm={horizontalLayout ? 3 : 12}>
      <ApiHighlight classes={classes} >
        <Typography>
          {lookerContent[0].filters[index].label}:
        </Typography>
        <Autocomplete
          id={`combo-box-dashboard-${lookerContent.id}`}
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
            customFilterAction(lookerContent[0].id,
              lookerContent[0].filters[index].filterName,
              (newValue) ? newValue.label : '')
          }}
          renderInput={(params) => <TextField {...params}
            label={lookerContent[0].filters[index].filterName}
            variant="outlined"
          />}
          loadingText="Loading..."
        />
      </ApiHighlight>
    </Grid>
  )
}
