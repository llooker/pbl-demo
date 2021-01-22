import $ from 'jquery';
import React, { useEffect, useState, useContext } from 'react';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { Typography, Grid, Card, CircularProgress } from '@material-ui/core';
import { EmbedHighlight } from './Accessories/Highlight';
import { appContextMap } from '../utils/tools';

export function EmbeddedQuery({ lookerContentItem, classes, id }) {

  const [iFrameExists, setIFrame] = useState(0);
  const { clientSession, isReady } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME])
  const { lookerUser } = clientSession;


  useEffect(() => {
    console.log("useEffect outer");
    console.log({ lookerUser });
    console.log({ isReady });
    if (isReady) {
      console.log("useEffect inner");
      fetchData()
    }
  }, [lookerUser, isReady])

  const fetchData = async () => {
    console.log("fetchData")
    $(`#${id}`).html('')
    setIFrame(0)

    let queryUrl = encodeURIComponent(`${lookerContentItem.queryUrl}${document.location.origin}`)

    await fetch(`/auth?src=${queryUrl}`)
      .then(response => response.json())
      .then(data => {

        LookerEmbedSDK.createExploreWithUrl(data.url)
          .appendTo(document.getElementById(id))
          .withClassName('explore')
          .withClassName('splashPage')
          .withClassName(lookerContentItem.id)
          .withTheme('atom_fashion')
          .build()
          .connect()
          .then((explore) => {
            setIFrame(1)
            let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
            console.log({ modifiedBaseUrl })
            LookerEmbedSDK.init(modifiedBaseUrl)
          })
          .catch((error) => {
            // console.log('catch', error)
          })
      })
  }

  return (

    <Card className={`${classes.padding15} 
    // ${classes.overflowHidden} 
    ${classes.lookerCardShadow}
    `}
    >
      <div
        className={`${classes.overflowHidden}`}
        style={{ height: lookerContentItem.height }}
      >
        {
          iFrameExists ? '' :

            <Grid item sm={12} >
              <Card className={`${classes.card} ${classes.flexCentered} ${classes.maxHeight350} ${classes.overflowHidden}`} elevation={0}>
                <CircularProgress className={classes.circularProgress}
                />
              </Card>
            </Grid>
        }
        <Grid container spacing={4}>
          <Grid item sm={12}>
            <EmbedHighlight classes={classes}
              height={iFrameExists ? 350 : 0}
            >
              <Typography variant="h6" align="center" color="secondary">
                {lookerContentItem.title}
              </Typography>
              <div
                className={`embedContainer embedContainerNoHeader splashPage ${classes.overflowHidden} ${classes.maxHeight80Percent}`}
                id={id}
                key={id}
              >
              </div>
            </EmbedHighlight>
          </Grid></Grid>
      </div >
    </Card >
  );
}