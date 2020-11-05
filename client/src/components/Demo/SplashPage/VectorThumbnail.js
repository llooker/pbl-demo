import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';
import { Link } from "react-router-dom";
import AppContext from '../../../contexts/AppContext';
import { ApiHighlight } from '../../Highlights/Highlight';
import { Typography, Grid, Divider } from '@material-ui/core';

export function VectorThumbnail({ lookerContent, classes, item, index }) {
  // console.log('VectorThumbnail')

  const [svg, setSvg] = useState(undefined)
  // const { userProfile, lookerUser, show, sdk, corsApiCall } = useContext(AppContext);
  const { clientSession, sdk, corsApiCall } = useContext(AppContext)
  const { userProfile, lookerUser } = clientSession;

  useEffect(() => {
    let isSubscribed = true
    corsApiCall(getThumbnail).then(response => {
      // console.log({ response })
      if (isSubscribed) {
        setSvg(response)
      }
    })
    return () => isSubscribed = false
  }, [item, lookerUser]);

  const getThumbnail = async () => {
    let clientLookerResponse = await sdk.ok(sdk.content_thumbnail({ type: item.resourceType, resource_id: item.id }));
    const blob = new Blob([clientLookerResponse], { type: 'image/svg+xml' });
    let url = URL.createObjectURL(blob);
    return url;
  }

  return (
    <Grid container
      className={`${classes.cursorPointer}`}
      spacing={3}
      component={Link}
      to={item.demoComponentId}
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
            <Typography variant="subtitle1"  >{item.label}</Typography>
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