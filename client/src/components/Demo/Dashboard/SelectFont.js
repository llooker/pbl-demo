import React from 'react';
import { Grid, FormControl, Select, MenuItem, InputLabel } from '@material-ui/core'
import { EmbedHighlight } from '../../Highlights/Highlight';

export default function SelectFont({ lookerContent, classes, type, fontThemeSelectValue, handleThemeChange }) {
  return (
    <Grid item sm={2}>
      <EmbedHighlight classes={classes} >

        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label"
          >Change font</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={fontThemeSelectValue}
            onChange={(event) => {
              handleThemeChange(null, event.target.value)
            }}
          >
            <MenuItem value="arial">Arial</MenuItem>
            <MenuItem value="roboto">Roboto</MenuItem>
            <MenuItem value="vollkorn">Vollkorn</MenuItem>
          </Select>
        </FormControl>

      </EmbedHighlight>
    </Grid>
  )
}
