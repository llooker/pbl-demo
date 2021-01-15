import React from 'react';
import { Typography, Grid, Switch } from '@material-ui/core'
import { EmbedHighlight } from "@pbl-demo/components";


export default function SwitchTheme({ lookerContent, classes, lightThemeToggleValue, handleThemeChange }) {
  return (
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
  )
}
