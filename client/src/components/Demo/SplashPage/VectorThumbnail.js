import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ApiHighlight } from '../../Highlights/Highlight';

import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export function VectorThumbnail({ lookerContent, classes, onClick, item }) {
  const [svg, setSvg] = useState(undefined)

  useEffect(() => {
    if (item) {
      getThumbnail();
    }
  }, [item])

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
    <Grid item sm={6}>
      <Typography variant="subtitle1" className={`${classes.textCenter}`} color="secondary">{item.label}</Typography>
      <div
        onClick={() => onClick(item.id, 1)}
        className={classes.maxHeight100}
      >
        <ApiHighlight>
          <img
            onClick={() => onClick(item.id, 1)}
            src={svg} />
        </ApiHighlight>

      </div>
    </Grid>
  );
}
