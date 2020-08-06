import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, FormControlLabel, Switch, Typography, Button } from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';
import clsx from 'clsx';

import AppContext from '../../AppContext';


export default function BottomBar(props) {
  // console.log('BottomBar')
  // console.log('props', props)

  const { classes } = props
  const { toggleShow } = useContext(AppContext)
  const { show } = useContext(AppContext)
  const { toggleCodeShow } = useContext(AppContext)
  const { codeShow } = useContext(AppContext)
  const { lookerUser } = props;

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBarBottom)}
      color="default"
    >
      <Toolbar>
        <FormControlLabel
          control={<Switch checked={show} onChange={toggleShow} />}
          label="Show source"
          className={`${classes.mlAuto}`}
        />
        <Button variant="outlined"
          startIcon={<CodeIcon />}
          onClick={toggleCodeShow}>Code
          </Button>

      </Toolbar>
    </AppBar>
  );
}
