import $ from 'jquery';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { ApiHighlight, EmbedHighlight } from '../../Highlights/Highlight';
import { Typography, Grid, Card, CircularProgress, Box } from '@material-ui/core';

export function EmbeddedDashboard({ lookerContent, classes, id, lookerUser }) {


  const [iFrameExists, setIFrame] = useState(0);

  useEffect(() => {
    $(`#${id}`).html('')
    setIFrame(0)
    LookerEmbedSDK.createDashboardWithId(lookerContent.id)
      .appendTo(document.getElementById(id))
      .withClassName('dashboard')
      .withClassName('splashPage')
      .withClassName(lookerContent.id)
      .withNext()
      .withTheme('atom_fashion')
      .build()
      .connect()
      .then((look) => {
        setIFrame(1)
      })
      .catch((error) => {
        console.error('Connection error', error)
      })
  }, [lookerUser])

  return (

    <div
      className={` ${classes.maxHeight400} ${classes.textCenter} ${classes.overflowVisible}`}
    >
      {
        iFrameExists ? '' :

          <Grid item sm={12} >
            <Card className={`${classes.card} ${classes.flexCentered} ${classes.maxHeight400} `} elevation={0}>
              <CircularProgress className={classes.circularProgress} color={lookerContent.visColor}
              />
            </Card>
          </Grid>
      }
      <Box >
        <Grid item sm={12}>
          <EmbedHighlight>
            <div
              className={`embedContainer splashPage`}
              id={id}
              key={id}
            >
            </div>
          </EmbedHighlight>
        </Grid>
      </Box>
    </div >

  );
}