import $ from 'jquery';
import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Card } from '@material-ui/core'
import { Loader, CodeFlyout, EmbedHighlight } from '@pbl-demo/components/Accessories'
import { useStyles, topBarBottomBarHeight, additionalHeightForFlyout } from '@pbl-demo/components/styles';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { createEmbeddedExplore } from './helpers'
const { validIdHelper, appContextMap, validateContent } = require('../../utils/tools');

export const EmbeddedExplore = ({ staticContent: { lookerContent, type, schema } }) => {
  console.log("EmbeddedExplore")
  const [iFrameExists, setIFrame] = useState(1);
  const [apiContent, setApiContent] = useState(undefined);
  const [exploreObj, setExploreObj] = useState({});
  const [height, setHeight] = useState((window.innerHeight - topBarBottomBarHeight));
  const { clientSession, clientSession: { lookerUser, lookerHost }, isReady, sdk, corsApiCall, selectedMenuItem } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
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

  const performLookerApiCalls = (lookerContent) => {
    // console.log("performLookerApiCalls")
    // console.log({ lookerContent })
    $(`.embedContainer.${validIdHelper(type)}:visible`).html('')

    lookerContent.map(async lookerContentItem => {
      if (lookerContentItem.type === "explore") {
        let embeddedExplore = await createEmbeddedExplore({
          "LookerEmbedSDK": LookerEmbedSDK,
          lookerContentItem,
          containerId: validIdHelper(`#embedContainer-${demoComponentType}-${lookerContentItem.id}`),
          clientSession
        });
        // console.log({ embeddedExplore })
        setIFrame(embeddedExplore.iframe);
        setExploreObj(embeddedExplore.exploreObj)
      }
    })
  }

  const helperFunctionMapper = async ({ newValue, item }) => {
    // console.log("helperFunctionMapper");
    // console.log({ newValue })
    // console.log({ item })
    if (newValue === "Saved Queries") {
      //   //copy and exclude qid
      const lookerContentCopy = lookerContent.map(({ qid, ...rest }) => rest)
      performLookerApiCalls(lookerContentCopy);
    } else {
      performLookerApiCalls(lookerContent);
    }
  }

  return (
    <div className={`${classes.root} ${classes.positionRelative}`}
      style={{ height }}
    >
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
                <CodeFlyout
                  classes={classes}
                  lookerUser={lookerUser}
                  height={height - additionalHeightForFlyout}
                />

                {lookerContent[0].actions ?
                  <Grid container>
                    {lookerContent[0].actions.map(item => {
                      console.log({ item })
                      let Component = item.component
                      return (
                        <Grid item sm={item.gridWith}>
                          <Component classes={classes} item={item} helperFunctionMapper={helperFunctionMapper} />
                        </Grid>
                      )
                    })}
                  </Grid>
                  : ""}


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