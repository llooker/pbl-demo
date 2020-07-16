import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ApiHighlight } from '../../Highlights/Highlight';

import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Grid, CircularProgress } from '@material-ui/core';
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
      {svg ?
        <Grid item sm={12}>
          <Typography variant="subtitle1" className={`${classes.textCenter}`} color="secondary">{item.label}</Typography>
          <div
            onClick={() => onClick(item.id, 1)}
            className={` ${classes.maxHeight100} ${classes.textCenter}`}
          >
            <ApiHighlight>
              <img
                onClick={() => onClick(item.id, 1)}
                src={svg} />
            </ApiHighlight>

          </div> </Grid>
        :

        ''
        // <Grid item sm={12} >
        //   <Card className={` ${classes.flexCentered} ${classes.minHeight200}`}>
        //     <CircularProgress className={classes.circularProgress} color={lookerContent.visColor}
        //       style={{ color: `${lookerContent.visColor}` }} />
        //   </Card>
        // </Grid>
      }
    </Grid>

  );
}
