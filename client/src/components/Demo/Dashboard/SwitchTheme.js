import React from 'react';
import { Typography, Grid, Switch } from '@material-ui/core'
import { EmbedMethodHighlight, EmbedHighlight } from '../../Highlights/Highlight';
const { validIdHelper } = require('../../../tools');

export default function SwitchTheme({ lookerContent, classes, type, lightThemeToggleValue, handleThemeChange }) {
  return (
    <Grid item sm={1}>
      <EmbedHighlight classes={classes} >
        <Typography
        >{lightThemeToggleValue ? "Light mode" : "Dark mode"}</Typography>

        <Switch
          checked={!lightThemeToggleValue}
          onChange={() => handleThemeChange(null, !lightThemeToggleValue)}
          color="primary"
          name="light theme toggle"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />

      </EmbedHighlight>
    </Grid>
  )
}
