import React, { useEffect, useRef, useCallback } from 'react';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { ApiHighlight, EmbedHighlight } from '../../Highlights/Highlight';
import { Typography } from '@material-ui/core';

export function SplashLook({ lookerContent, classes, id }) {

  useEffect(() => {
    LookerEmbedSDK.createLookWithId(lookerContent.id)
      .appendTo(document.getElementById(id))
      .withClassName('look')
      .withClassName(lookerContent.id)
      .build()
      .connect()
      .catch((error) => {
        console.error('Connection error', error)
      })
  }, [])

  useEffect(() => {

  }, [])

  return (
    <div
      className={`embedContainer ${classes.maxHeight200} ${classes.textCenter} ${classes.cursor}`}
    >
      <Typography variant="h5" component="h5" className={classes.gridTitle} align="center">
        {lookerContent.label}<br />
      </Typography>
      <br />
      <EmbedHighlight id={id} />
    </div>
  );
}