import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Card } from '@material-ui/core'
import { Loader, CodeFlyout, EmbedHighlight } from '@pbl-demo/components/Accessories'
import { useStyles, topBarBottomBarHeight, additionalHeightForFlyout } from './styles.js';
import { LookerEmbedSDK } from '@looker/embed-sdk'
const { validIdHelper, appContextMap, validateContent } = require('../utils/tools');

export const EmbeddedExplore = (props) => {
  const [iFrameExists, setIFrame] = useState(1);
  const [apiContent, setApiContent] = useState(undefined);
  const [exploreObj, setExploreObj] = useState({});
  const [height, setHeight] = useState((window.innerHeight - topBarBottomBarHeight));
  const { clientSession, clientSession: { lookerUser, lookerHost }, isReady, sdk, corsApiCall, selectedMenuItem } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const { staticContent: { lookerContent, type, schema } } = props;
  const demoComponentType = type;
  const classes = useStyles();

  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - topBarBottomBarHeight)));
  }, [lookerContent]);

  useEffect(() => {
    if (isReady) {
      corsApiCall(performLookerApiCalls, [[...lookerContent]])
      setApiContent(undefined);
    }
  }, [lookerUser, isReady, selectedMenuItem])

  // needed to copy from home to make it work
  useEffect(() => {
    let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
    LookerEmbedSDK.init(modifiedBaseUrl, '/auth')
  }, [])

  const performLookerApiCalls = function (lookerContent) {
    // console.log("performLookerApiCalls")
    // console.log({ lookerContent })
    lookerContent.map(async lookerContentItem => {
      if (lookerContentItem.type === "explore") {
        let exploreId = lookerContentItem.id;
        let qid = lookerContentItem.qid;
        if (qid) {
          LookerEmbedSDK.createExploreWithId(exploreId)
            .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContentItem.id}`))
            .withClassName('exploreIframe')
            .withParams({
              qid: lookerContentItem.qid,
              toggle: "&toggle=fil,pik"
            })
            .on('explore:state:changed', (event) => {
            })
            .build()
            .connect()
            .then((explore) => {
              setIFrame(1)
              setExploreObj(explore)
              let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
              LookerEmbedSDK.init(modifiedBaseUrl)
            })
            .catch((error) => {
              console.error('Connection error', error)
            })
        } else {
          LookerEmbedSDK.createExploreWithId(exploreId)
            .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContentItem.id}`))
            .withClassName('exploreIframe')
            .on('explore:state:changed', (event) => {
            })
            .build()
            .connect()
            .then((explore) => {
              setIFrame(1)
              setExploreObj(explore)
              let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
              LookerEmbedSDK.init(modifiedBaseUrl)
            })
            .catch((error) => {
              console.error('Connection error', error)
            })
        }
      }
    })
  }

  return (
    <div className={`${classes.root} demoComponent`}
      style={{ height }}>
      <Card elevation={1}
        className={`${classes.padding15} ${classes.height100Percent} ${classes.overflowScroll}`}
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
                  height={height - additionalHeightForFlyout}
                />
                <Grid item
                  sm={12}
                >
                  <Box className={`${classes.w100} ${classes.padding10}`} mt={lookerContent[0].filter || lookerContent[0].dynamicFieldLookUp ? 2 : 0}>
                    <EmbedHighlight classes={classes}>
                      <div
                        className={`embedContainer ${validIdHelper(type)}`}
                        id={validIdHelper(`embedContainer-${demoComponentType}-${lookerContent[0].id}`)}
                        key={validIdHelper(`embedContainer-${demoComponentType}-${lookerContent[0].id}`)}
                      >
                      </div>
                    </EmbedHighlight>
                  </Box>
                </Grid>
              </Grid>
            </Box >
          </div >
        </Grid >
      </Card >
    </div >
  )
}