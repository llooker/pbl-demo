import $ from 'jquery';
import React, { useEffect, useState, useContext } from 'react';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { Typography, Grid, Card, CircularProgress } from '@material-ui/core';
import { EmbedHighlight } from './Accessories/Highlight';
import { appContextMap, validIdHelper } from '../utils/tools';
import { Loader } from "./Accessories";
import { errorHandler } from '@pbl-demo/utils'


export function EmbeddedQuery({ lookerContentItem, classes, id }) {
  console.log("EmbeddedQuery")
  console.log({ lookerContentItem })

  const [iFrameExists, setIFrame] = useState(0);
  const { clientSession, isReady } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME])
  const { lookerUser } = clientSession;


  useEffect(() => {
    // console.log("useEffect outer");
    // console.log({ lookerUser });
    // console.log({ isReady });
    if (isReady) {
      // console.log("useEffect inner");
      fetchData()
    }
  }, [lookerUser, isReady])

  const idToUse = validIdHelper(`embedContainer-${lookerContentItem.type}-${lookerContentItem.id}`);

  const fetchData = async () => {
    // console.log("fetchData")
    $(`#${idToUse}`).html('')
    setIFrame(0)

    try {
      console.log("inside try")
      let queryUrl = encodeURIComponent(`${lookerContentItem.queryUrl}${document.location.origin}`)
      await fetch(`/auth?src=${queryUrl}`)
        .then(response => response.json())
        .then(data => {

          LookerEmbedSDK.createExploreWithUrl(data.url)
            .appendTo(document.getElementById(idToUse))
            .withClassName('explore')
            .withClassName('splashPage')
            .withClassName(lookerContentItem.id)
            .withClassName(`${classes.w100}`)
            .withTheme('atom_fashion')
            .build()
            .connect()
            .then((explore) => {
              setIFrame(1)
              let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
              LookerEmbedSDK.init(modifiedBaseUrl)
            })
            .catch((error) => {
              // console.log('catch', error)
            })
        }).then(() => {
          setIFrame(1)
        })
    } catch (err) {
      console.log("inside catch")
      errorHandler.report(err);
    }
  }

  return (
    <Card className={`${classes.padding15} ${classes.overflowHidden}`}
      elevation={0}
    >
      <Loader
        hide={iFrameExists}
        classes={classes}
        height={lookerContentItem} />

      <div
        className={`${classes.overflowYScroll}`}
        style={{ height: lookerContentItem.height }}
      >
        <Grid container
          spacing={0}>
          <Grid item sm={12}>
            <Typography variant="h6" align="center" color="secondary">
              {lookerContentItem.title}
            </Typography>
          </Grid>

          <Grid container
            spacing={0}
            alignItems="center"
            alignContent="center"
            justify="center"
          >
            <Grid item sm={12}>
              <EmbedHighlight
                classes={classes}>
                <div
                  className={`embedContainer embedContainerNoHeader splashPage 
                 ${classes.overflowHidden} ${classes.maxHeight80Percent}`}
                  id={idToUse}
                  key={idToUse}
                >
                </div>
              </EmbedHighlight>
            </Grid>
          </Grid>
        </Grid>
      </div >
    </Card>
  );
}