import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Card } from '@material-ui/core'
import AppContext from '../../../contexts/AppContext';
import { Welcome, SingleValueVis, PopularAnalysis, EmbeddedQuery } from "@pbl-demo/components";
import { Loader, CodeFlyout } from '@pbl-demo/components/Accessories'
import { useStyles, topBarBottomBarHeight } from '../styles.js';
const { validIdHelper } = require('../../../tools');

export default function SplashPage(props) {

  const [iFrameExists, setIFrame] = useState(1);
  const [height, setHeight] = useState((window.innerHeight - topBarBottomBarHeight));

  const { clientSession, codeShow } = useContext(AppContext)
  const { lookerUser, lookerHost } = clientSession

  const classes = useStyles();
  const { staticContent, staticContent: { lookerContent }, staticContent: { type } } = props;

  const demoComponentType = type || 'code flyout';

  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - topBarBottomBarHeight)));
  }, [lookerContent]);

  return (
    <div className={`${classes.root} demoComponent`}
      style={{ height }}>
      <Card elevation={1} className={`${classes.padding30} 
      ${classes.height100Percent}
      ${classes.overflowScroll}`}
      >
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
                  height={height}
                />
                {lookerContent.map((lookerContentItem, innerIndex) => {
                  // console.log({ lookerContentItem })
                  return (
                    <Grid
                      key={`${validIdHelper(demoComponentType + '-innerFragment-' + innerIndex)}`}
                      item
                      sm={parseInt(lookerContentItem.gridWidth)}
                    >
                      {(lookerContentItem.type === 'welcome') && <Welcome
                        {...{ lookerContentItem, classes }}
                      />}
                      {(lookerContentItem.type === 'single value') && <SingleValueVis
                        {...{ lookerContentItem, classes, demoComponentType, lookerHost }}
                      />}
                      {(lookerContentItem.type === 'embeddedquery') && <EmbeddedQuery
                        {...{ lookerContentItem, classes, lookerHost }} id={validIdHelper(`embedContainer-${demoComponentType}-${lookerContent.id}`)}
                      />}
                      {(lookerContentItem.type === 'popular analysis') && <PopularAnalysis
                        {...{ lookerContentItem, classes, demoComponentType, lookerHost }}
                      />}
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