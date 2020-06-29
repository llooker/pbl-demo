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
  // const classes = useStyles();
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
    setSvg(lookerResponseData.svg)
  }

  return (


    // <Card className={classes.root}>
    //   <CardActionArea>
    //     <CardMedia
    //       className={classes.media}
    //       // children={svg}
    //       title="Contemplative Reptile"
    //     >
    //       <ApiHighlight
    //         // height={"144px"}
    //         // width={"306px"}
    //         // margin={"auto"}
    //         maxHeight={"200px"}
    //         dangerouslySetInnerHTML={{ __html: svg || '' }}
    //         onClick={onClick}
    //       />
    //     </CardMedia>
    //     <CardContent>
    //       <Typography gutterBottom variant="h5" component="h2">
    //         {lookerContent.label}
    //       </Typography>
    //     </CardContent>
    //   </CardActionArea>
    // </Card>

    <div
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
        dangerouslySetInnerHTML={{ __html: svg || '' }}
        onClick={onClick}
      >
      </ApiHighlight>
    </div>
  );
}
