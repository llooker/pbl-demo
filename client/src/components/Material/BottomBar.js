import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import { Code, HighlightOutlined } from '@material-ui/icons';
import clsx from 'clsx';

import AppContext from '../../AppContext';


export default function BottomBar(props) {
  // console.log('BottomBar')
  // console.log('props', props)

  const { classes } = props
  const { toggleShow } = useContext(AppContext)
  const { toggleCodeShow } = useContext(AppContext)

  return (
    <Grid container
      className={`${classes.mtAuto} ${classes.mb20}`}>
      <Grid item sm={6}>
        <Button
          display="inline"
          startIcon={<HighlightOutlined />}
          onClick={toggleShow}>Source
      </Button>
      </Grid>
      <Grid item sm={6}>
        <Button
          className={`${classes.ml12}`}
          display="inline"
          startIcon={<Code />}
          onClick={toggleCodeShow}>Code
      </Button>
      </Grid>
    </Grid >
  );
}
