import React, { useEffect, useRef, useCallback, useState } from 'react';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { ApiHighlight, EmbedHighlight } from '../../Highlights/Highlight';
import { Typography, Grid, Card, CircularProgress, Box } from '@material-ui/core';

export function EmbeddedLook({ lookerContent, classes, id, lookerHost }) {


  const [iFrameExists, setIFrame] = useState(0);

  useEffect(() => {
    LookerEmbedSDK.createLookWithId(lookerContent.id)
      .appendTo(document.getElementById(id))
      .withClassName('look')
      .withClassName('splashPage')
      .withClassName(lookerContent.id)
      .build()
      .connect()
      .then((look) => {
        setIFrame(1)
        LookerEmbedSDK.init(`https://${lookerHost}.looker.com`);
      })
      .catch((error) => {
        console.error('Connection error', error)
      })
  }, [])

  useEffect(() => {

  }, [])

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
      <Box className={iFrameExists ? `` : `${classes.hidden}`}>
        <EmbedHighlight id={id} className={`embedContainer ${classes.maxHeight400} ${classes.textCenter} ${classes.cursor}`} />
      </Box>
    </div >

  );
}