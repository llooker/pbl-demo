import $ from 'jquery';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { ApiHighlight, EmbedHighlight } from '../../Highlights/Highlight';
import { Typography, Grid, Card, CircularProgress, Box } from '@material-ui/core';
const { validIdHelper } = require('../../../tools');

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
      className={` ${classes.maxHeight400} ${classes.textCenter}`}
    >
      {
        iFrameExists ? '' :
          <Grid item sm={12} >
            <Card className={`${classes.card} ${classes.flexCentered} ${classes.maxHeight400}`}>
              <CircularProgress className={classes.circularProgress} />
            </Card>
          </Grid>
      }
      {/* <Box className={iFrameExists ? `` : `${classes.hidden}`}>
        <EmbedHighlight id={id} className={`embedContainer ${classes.maxHeight400} ${classes.textCenter} ${classes.cursor}`} />
      </Box> */}


      <Box className={iFrameExists ? `` : `${classes.hidden}`}>
        <Grid item sm={12}>
          <EmbedHighlight height={400}>
            <div
              className={`embedContainer splashpage`}
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