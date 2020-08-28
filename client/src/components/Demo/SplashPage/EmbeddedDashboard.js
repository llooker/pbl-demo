import $ from 'jquery';
import React, { useEffect, useRef, useCallback, useState, useContext } from 'react';
import AppContext from '../../../AppContext';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { ApiHighlight, EmbedHighlight } from '../../Highlights/Highlight';
import { Typography, Grid, Card, CircularProgress, Box, Chip } from '@material-ui/core';

export function EmbeddedDashboard({ lookerContent, classes, id, lookerHost }) {

  const [iFrameExists, setIFrame] = useState(0);
  const { userProfile, lookerUser, show } = useContext(AppContext)

  useEffect(() => {
    $(`#${id}`).html('')
    setIFrame(0)
    LookerEmbedSDK.createDashboardWithId(lookerContent.slug)
      .appendTo(document.getElementById(id))
      .withClassName('dashboard')
      .withClassName('splashPage')
      .withClassName(lookerContent.id)
      // .withNext()
      .withTheme('atom_fashion')
      .build()
      .connect()
      .then((look) => {
        setIFrame(1)
        LookerEmbedSDK.init(`https://${lookerHost}.looker.com`);
      })
      .catch((error) => {
        console.error('Connection error', error)
      })
  }, [lookerUser])

  return (

    <Card className={classes.padding15} variant="outlined">

      <div
        className={`${classes.textCenter} ${classes.overflowVisible}`}
        style={
          { height: lookerContent.height }
        }
      >
        {
          iFrameExists ? '' :

            <Grid item sm={12} >
              <Card className={`${classes.card} ${classes.flexCentered} ${classes.maxHeight400} `} elevation={0}>
                <CircularProgress className={classes.circularProgress}
                />
              </Card>
            </Grid>
        }
        {/* <Box > */}
        <Grid container spacing={3}>
          <Grid item sm={12}>
            <EmbedHighlight classes={classes} height={380}>
              <div
                className={`embedContainer embedContainerNoHeader splashPage`}
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