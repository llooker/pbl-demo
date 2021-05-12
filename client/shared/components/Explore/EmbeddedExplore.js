import $ from 'jquery';
import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Card } from '@material-ui/core'
import { Loader, CodeFlyout, EmbedHighlight } from '@pbl-demo/components/Accessories'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { createEmbeddedExplore } from './helpers'
import { AdjacentContainer } from "../AdjacentContainer"
import { useStyles } from '../styles.js';

const { validIdHelper, appContextMap, validateContent } = require('../../utils/tools');

// export const EmbeddedExplore = ({ staticContent: { lookerContent, type, schema, dynamicPadding } }) => {
export const EmbeddedExplore = ({ staticContent, dynamicPadding }) => {

  // console.log("EmbeddedExplore")
  const { clientSession, clientSession: { lookerUser, lookerHost }, isReady, sdk, corsApiCall, selectedMenuItem, drawerOpen } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const { lookerContent, type } = staticContent;
  const dynamicTopBarBottomBarHeight = dynamicPadding;
  const [iFrameExists, setIFrame] = useState(1);
  const [apiContent, setApiContent] = useState(undefined);
  const [exploreObj, setExploreObj] = useState({});
  const [height, setHeight] = useState((window.innerHeight - dynamicTopBarBottomBarHeight));

  const demoComponentType = type;
  const classes = useStyles();

  console.log({ height })

  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - dynamicTopBarBottomBarHeight)));
  })

  useEffect(() => {
    setHeight((window.innerHeight - dynamicTopBarBottomBarHeight));
  }, [drawerOpen])

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
    <div
      className={`${classes.root} ${classes.positionRelative}`}
      style={{ height }}
    >
      <Card elevation={1}
        className={classes.height100Percent}
      >
        <Grid
          container
          spacing={3}
          key={validIdHelper(type)}
        >
          <Loader
            hide={iFrameExists}
            classes={classes}
            height={height} />


          <Grid item
            sm={12}
          >
            <Box className={`${classes.w100} `}>
              <EmbedHighlight classes={classes}>
                <div
                  className={`embedContainer ${validIdHelper(type)}`}
                  id={validIdHelper(`embedContainer-${demoComponentType}-${lookerContent[0].id}`)}
                  key={validIdHelper(`embedContainer-${demoComponentType}-${lookerContent[0].id}`)}
                // style={{ height }}

                >
                </div>
              </EmbedHighlight>
            </Box>
          </Grid>


          {/* AdjacentContainer */}
          {/* {lookerContent[0].actions ?
            <Grid item
              sm={12}
            >
              <Grid container>
                {lookerContent[0].actions.map(item => {
                  let Component = item.component
                  return (
                    <Grid item sm={item.gridWith}>
                      <Component classes={classes} item={item} helperFunctionMapper={helperFunctionMapper} />
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
            : ""} */}

          {lookerContent[0].hasOwnProperty("adjacentContainer") ?

            <AdjacentContainer
              container={lookerContent[0].adjacentContainer}
              makeShiftDrawerOpen={true}
              apiContent={apiContent}
              helperFunctionMapper={helperFunctionMapper}
              classes={classes}
            />
            : ""}


          <CodeFlyout
            classes={classes}
            lookerUser={lookerUser}
            height={height}
          />
        </Grid>
      </Card >
    </div >
  )
}