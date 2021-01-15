import React from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@material-ui/core'
import { EmbedHighlight } from "@pbl-demo/components";


export default function SelectFont({ lookerContent, classes, fontThemeSelectValue, handleThemeChange }) {
  return (
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
  )
}
