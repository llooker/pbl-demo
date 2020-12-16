import React, { useContext } from 'react';
import { Button, Grid } from '@material-ui/core';
import { Code, HighlightOutlined } from '@material-ui/icons';
import AppContext from '../../contexts/AppContext';


export default function BottomBar(props) {
  // console.log('BottomBar')
  // console.log('props', props)

  const { classes } = props
  const { highlightShow, setHighlightShow,
    codeShow, setCodeShow } = useContext(AppContext)

  return (
    <Grid container
      className={`${classes.mtAuto} ${classes.mb10}`}>
      <Grid item sm={6}>
        <Button
          display="inline"
          startIcon={<HighlightOutlined />}
          onClick={() => {
            if (codeShow) setCodeShow(!codeShow)
            setHighlightShow(!highlightShow)
          }
          }>Source
      </Button>
      </Grid>
      <Grid item sm={6}>
        <Button
          className={`${classes.ml12}`}
          display="inline"
          startIcon={<Code />}
          onClick={() => {
            if (highlightShow) setHighlightShow(!highlightShow)
            setCodeShow(!codeShow)
          }}>Code
      </Button>
      </Grid>
    </Grid >
  );
}
