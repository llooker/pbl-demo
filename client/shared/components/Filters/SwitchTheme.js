import React, { useState } from 'react';
import { Typography, Grid, Switch } from '@material-ui/core'
import { EmbedHighlight } from '../Accessories/Highlight';

export const SwitchTheme = ({ classes, filterItem, helperFunctionMapper }) => {
  const [lightThemeToggleValue, setLightThemeToggleValue] = useState(true);

  return (
    <EmbedHighlight classes={classes} >
      <Typography
      >{lightThemeToggleValue ? "Light mode" : "Dark mode"}</Typography>

      <Switch
        checked={!lightThemeToggleValue}
        onChange={(event, newValue) => {
          setLightThemeToggleValue(!event.target.checked)
          helperFunctionMapper(event, !event.target.checked, filterItem)
        }}
        color="primary"
        name="light theme toggle"
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />

    </EmbedHighlight>
  )
}
