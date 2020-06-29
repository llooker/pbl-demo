import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ApiHighlight } from '../../Highlights/Highlight';
import { Typography } from '@material-ui/core';

export function SplashThumbnail({lookerContent, classes}) {
  const [svg, setSvg] = useState(undefined)
 
  useEffect(()=>{
    if (lookerContent) {
      getThumbnail();
    }
  },[lookerContent])

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
    <div
      className={`embedContainer ${classes.maxHeight200} ${classes.textCenter} ${classes.cursor}`}
    >
      <Typography variant="h5" component="h5" className={classes.gridTitle} align="center">
        {lookerContent.label}
      </Typography>
      <br/>   
      <ApiHighlight 
        height={"144px"} 
        width={"306px"} 
        margin={"auto"}
        dangerouslySetInnerHTML={{ __html: svg || '' }}
      >
      </ApiHighlight>
    </div>
  );
}
