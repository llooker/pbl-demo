import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Card } from '@material-ui/core'
import { Loader, CodeFlyout } from '@pbl-demo/components/Accessories'
import { useStyles, topBarBottomBarHeight } from './styles.js';
const { validIdHelper, appContextMap, validateContent } = require('../utils/tools');

export const ApplicationViewer = (props) => {
  const [iFrameExists, setIFrame] = useState(1);
  const [height, setHeight] = useState((window.innerHeight - topBarBottomBarHeight));
  const { clientSession: { lookerUser, lookerHost } } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const { staticContent: { lookerContent, type, schema } } = props;
  const demoComponentType = type;
  const classes = useStyles();

  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - topBarBottomBarHeight)));
  }, [lookerContent]);

  validateContent(lookerContent[0], schema)

  return (
    <div className={`${classes.root} demoComponent`}
      style={{ height }}>
      <Card elevation={1}
        className={`${classes.padding30} ${classes.height100Percent} ${classes.overflowScroll}`}
      >
        <Grid container
          key={validIdHelper(type)}>
          <div className={classes.root}>

            <Loader
              hide={iFrameExists}
              classes={classes}
              height={height} />

            <Box className={iFrameExists ? `` : `${classes.hidden}`}>
              <Grid container
                spacing={3}
                key={`${validIdHelper(demoComponentType + '-outerFragment')}`}
                className={`${classes.noContainerScroll}`}
              >

                <CodeFlyout {...props}
                  classes={classes}
                  lookerUser={lookerUser}
                  height={height}
                />

                <object data={lookerContent[0].pdf} type="application/pdf" className={`${classes.minHeight680} ${classes.w100}`}>
                  <iframe src={`https://docs.google.com/viewer?url=${lookerContent[0].pdf}&embedded=true`} style={{ height: "100%", width: "100%" }}></iframe>
                </object>

              </Grid>
            </Box >
          </div >
        </Grid >
      </Card >
    </div >
  )
}