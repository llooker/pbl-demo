import React from 'react';
import { Typography, Grid, Switch } from '@material-ui/core'
import { EmbedMethodHighlight, EmbedHighlight } from '../../Highlights/Highlight';
const { validIdHelper } = require('../../../tools');

export default function SwitchTheme({ lookerContent, classes, type, lightThemeToggleValue, handleThemeChange, horizontalLayout }) {
  return (
    <Grid item sm={horizontalLayout ? 1 : 12}>
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
