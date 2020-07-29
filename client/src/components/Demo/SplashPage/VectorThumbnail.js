import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';
import AppContext from '../../../AppContext';
import { ApiHighlight } from '../../Highlights/Highlight';

import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Grid, CircularProgress, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export function VectorThumbnail({ lookerContent, classes, item, handleMenuItemSelect }) {
  const [svg, setSvg] = useState(undefined)
  const { userProfile, lookerUser } = useContext(AppContext)

  useEffect(() => {
    if (item) {
      getThumbnail();
    }
  }, [item, lookerUser])

  const getThumbnail = async () => {
    let lookerResponse = await fetch(`/getthumbnail/${item.resourceType}/${item.id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    let lookerResponseData = await lookerResponse.json();
    const blob = new Blob([lookerResponseData.svg], { type: 'image/svg+xml' });
    let url = URL.createObjectURL(blob);
    setSvg(url)
  }

  return (
    <Grid container
      alignItems="center"
      spacing={3}
      onClick={() => handleMenuItemSelect(item.id, 1)}
      className={`${classes.cursorPointer}`}
    >
      {svg ?
        <>
          <Grid item sm={6}>
            <ApiHighlight>
              <div
                className={` ${classes.maxHeight100} ${classes.textCenter} ${classes.cursorPointer} ${classes.overflowHidden}`}
              >
                <img
                  onClick={() => handleMenuItemSelect(item.id, 1)}
                  src={svg} />

              </div>
            </ApiHighlight>
          </Grid>
          <Grid item sm={5}>
            <Typography variant="subtitle1"  >{item.label}</Typography>
          </Grid>
          <Grid item sm={12}>
            <Divider className={`${classes.divider} ${classes.mb12} ${classes.mt12}`} />
          </Grid>
        </>
        :
        ''
      }
    </Grid >

  );
}
