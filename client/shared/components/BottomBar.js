import React, { useContext } from 'react';
import { AppBar, Toolbar, Button } from '@material-ui/core';
import { Code, HighlightOutlined } from '@material-ui/icons';
import { appContextMap } from '../utils/tools';


export const BottomBar = ({ classes }) => {
  // console.log('BottomBar')

  const { highlightShow, setHighlightShow,
    codeShow, setCodeShow } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME])

  return (
    <AppBar position="fixed" color="transparent" className={classes.appBarBottom} >
      <Toolbar variant="dense">
        <Button
          className={`${classes.mlAuto} ${classes.mr12}`}
          display="inline"
          startIcon={<HighlightOutlined />}
          onClick={() => {
            if (codeShow) setCodeShow(!codeShow)
            setHighlightShow(!highlightShow)
          }
          }>Source
    </Button>
        <Button
          display="inline"
          startIcon={<Code />}
          onClick={() => {
            if (highlightShow) setHighlightShow(!highlightShow)
            setCodeShow(!codeShow)
          }}>Code
      </Button>
      </Toolbar>
    </AppBar >
  );
}
