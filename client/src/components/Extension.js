import React, { useState, useEffect, useContext, useCallback } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Box } from '@material-ui/core';
import { LookerEmbedSDK } from '@looker/embed-sdk';

// TODO embed_domain
const EMBED_DOMAIN = "http://localhost:8080"


const useStyles = makeStyles((theme) => ({  
  root: {
    width: "100%",
    height: "calc(100vh - 65px)",
    "& > iframe" : {
      width: "100%",
      height: "100%",
      display: "block"
    }
  }
}))

function Extension({staticContent, lookerHost, ...props}) {
  const [extension, setExtension] = useState()
  let {lookerContent} = staticContent;

  const classes = useStyles();

  const setupExtension = (ex) => {
    setExtension(ex)
  }

  const embedCtrRef = useCallback(el => {
    if (el) {
      LookerEmbedSDK.createExploreWithUrl(`https://${lookerHost}.looker.com/embed/extensions/${lookerContent[0].id}?embed_domain=${EMBED_DOMAIN}&sdk=2`)
        .appendTo(el)
        .on('extension:ready', console.log)
        .on('extension:run:start', console.log)
        .on('extension:run:complete', console.log)
        .on('page:changed', console.log)
        .build()
        .connect()
        .then(setupExtension)
        .catch((error) => {
          console.error('Connection error', error)
        })
    }
  }, [])

  return (
    <Box 
      className={classes.root} 
      ref={embedCtrRef}
    />
  );
}

export default Extension;