import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Card } from '@material-ui/core'
import { Loader, CodeFlyout } from '@pbl-demo/components/Accessories'
import { appContextMap, validIdHelper } from '../utils/tools';
import { useStyles, topBarBottomBarHeight, additionalHeightForFlyout } from './styles.js';

export const SplashPage = (props) => {

  const [iFrameExists] = useState(1);
  const [height, setHeight] = useState((window.innerHeight - topBarBottomBarHeight));
  const { clientSession: { lookerUser, lookerHost } } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME])
  const { staticContent: { lookerContent }, staticContent: { type } } = props;
  const classes = useStyles();
  const demoComponentType = type || 'code flyout';

  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - topBarBottomBarHeight)));
  }, [lookerContent]);


  return (
    <div className={`${classes.root}`}
      style={{ height }}>
      <Card elevation={1} className={`${classes.padding15} ${classes.height100Percent} ${classes.overflowScroll}`}>
        <Grid container
          key={validIdHelper(type)}>
          <div className={classes.root}>
            <Loader hide={iFrameExists} classes={classes} height={height} />

            <Box className={iFrameExists ? `` : `${classes.hidden}`}>
              <Grid container
                spacing={3}
                key={`${validIdHelper(demoComponentType + '-outerFragment')}`}
                className={`${classes.noContainerScroll}`}
              >
                <CodeFlyout {...props}
                  classes={classes}
                  lookerUser={lookerUser}
                  height={height - additionalHeightForFlyout}
                />
                {lookerContent.map((lookerContentItem, innerIndex) => {
                  const ComponentToRender = lookerContentItem.component
                  return (
                    <Grid
                      key={`${validIdHelper(demoComponentType + '-innerFragment-' + innerIndex)}`}
                      item
                      sm={parseInt(lookerContentItem.gridWidth)}
                    >
                      {ComponentToRender ? <ComponentToRender {...{ lookerContentItem, classes, demoComponentType, lookerHost }} /> : ""}
                    </Grid>
                  )
                })}
              </Grid>
            </Box >
          </div >
        </Grid >
      </Card >
    </div >
  )
}