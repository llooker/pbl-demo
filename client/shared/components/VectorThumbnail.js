import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { Grid } from '@material-ui/core';
import { ApiHighlight } from './Accessories/Highlight';
import { appContextMap } from '../utils/tools';

export function VectorThumbnail({ classes, id, url }) {
  const [svg, setSvg] = useState(null)
  const { clientSession, sdk, corsApiCall, isReady } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME])
  const {lookerUser } = clientSession;

  useEffect(() => {
    let isSubscribed = true
    if (isReady) {
      corsApiCall(getThumbnail).then(response => {
        if (isSubscribed) setSvg(response)
      })
    }
    return () => isSubscribed = false
  }, [lookerUser, isReady])

  const getThumbnail = async () => {
    if (id === undefined) return;

    let clientLookerResponse = await sdk.ok(sdk.content_thumbnail({ 
      type: "dashboard", resource_id: id 
    }));
    const blob = new Blob([clientLookerResponse], { type: 'image/svg+xml' });
    let url = URL.createObjectURL(blob);
    return url;
  }

  return svg ? (
    <ApiHighlight classes={classes}>
      <div className={classes.vectorThumbnail}>
        <Grid container
          className={`${classes.cursorPointer}`}
          spacing={3}>
          <div className={` ${classes.maxHeight60} ${classes.cursorPointer} ${classes.overflowHidden}`}>
            <img src={svg}/>
          </div>
        </Grid >
      </div>
    </ApiHighlight>
  ) : null;
}