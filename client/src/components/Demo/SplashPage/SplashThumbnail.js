import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ApiHighlight } from '../../Highlights/Highlight';

import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles({
//   root: {
//     maxWidth: 345,
//   },
//   media: {
//     height: 140,
//   },
// });



export function SplashThumbnail({ lookerContent, classes, onClick }) {
  const [svg, setSvg] = useState(undefined)

  useEffect(() => {
    if (lookerContent) {
      getThumbnail();
    }
  }, [lookerContent])

  const getThumbnail = async () => {
    let lookerResponse = await fetch(`/getthumbnail/${lookerContent.resourceType}/${lookerContent.id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    let lookerResponseData = await lookerResponse.json();
    const blob = new Blob([lookerResponseData.svg], {type: 'image/svg+xml'});
    let url = URL.createObjectURL(blob);
    setSvg(url)
  }

  return (

    <div 
      onClick={onClick}
      className={`embedContainer ${classes.maxHeight200} ${classes.textCenter} ${classes.cursor}`}
    >
      <Typography variant="h5" component="h5" className={classes.gridTitle} align="center">
        {lookerContent.label}
      </Typography>
      <br />
      <ApiHighlight
        height={"144px"}
        width={"306px"}
        margin={"auto"}
        onClick={onClick}
      >
        <img onClick={onClick} src={svg} />
      </ApiHighlight>
    </div>
  );
}
