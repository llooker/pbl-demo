import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { Typography, Grid, Divider } from '@material-ui/core';
import { ApiHighlight } from './Accessories/Highlight';
import { appContextMap } from '../utils/tools';

export function VectorThumbnail({ lookerContentItem, classes, vectorItem, index }) {
  // console.log('VectorThumbnail')

  const [svg, setSvg] = useState(undefined)
  const { clientSession, sdk, corsApiCall, isReady } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME])
  const { userProfile, lookerUser } = clientSession;

  useEffect(() => {
    let isSubscribed = true
    if (isReady) {
      corsApiCall(getThumbnail).then(response => {
        // console.log({ response })
        if (isSubscribed) {
          setSvg(response)
        }
      })
    }
    return () => isSubscribed = false
  }, [lookerUser, isReady])

  const getThumbnail = async () => {
    let clientLookerResponse = await sdk.ok(sdk.content_thumbnail({ type: vectorItem.resourceType, resource_id: vectorItem.id }));
    const blob = new Blob([clientLookerResponse], { type: 'image/svg+xml' });
    let url = URL.createObjectURL(blob);
    return url;
  }

  return (
    <Grid container
      className={`${classes.cursorPointer}`}
      spacing={3}
      component={Link}
      to={vectorItem.url}
    >
      {svg ?
        <>
          <Grid item sm={1} />
          <Grid item sm={6}>
            <ApiHighlight classes={classes}>
              <div
                className={` ${classes.maxHeight60} ${classes.textCenter} ${classes.cursorPointer} ${classes.overflowHidden}`}
              >
                <img
                  src={svg}
                  style={{ width: '100%' }}
                />

              </div>
            </ApiHighlight>
          </Grid>
          <Grid item sm={4}>
            <Typography variant="subtitle1"  >{vectorItem.label}</Typography>
          </Grid>
          {index < 2 ?
            <Grid item sm={12}>
              <Divider className={`${classes.divider} ${classes.mb12} ${classes.mt12}`} />
            </Grid> : ''}
        </>
        :
        ''
      }
    </Grid >
  );
}