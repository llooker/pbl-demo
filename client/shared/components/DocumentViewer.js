import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Card } from '@material-ui/core'
import { Loader, CodeFlyout } from '@pbl-demo/components/Accessories'
import { useLocation } from "react-router-dom";
import queryString from 'query-string';
import { useStyles } from './styles.js';
const { validIdHelper, appContextMap, validateContent } = require('../utils/tools');

export const DocumentViewer = ({ staticContent, dynamicPadding }) => {

  const { clientSession: { lookerUser, lookerHost }, drawerOpen } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const dynamicTopBarBottomBarHeight = dynamicPadding;
  const [iFrameExists, setIFrame] = useState(1);
  const [height, setHeight] = useState((window.innerHeight - dynamicTopBarBottomBarHeight));
  const { lookerContent, type, schema } = staticContent;
  const demoComponentType = type;
  const classes = useStyles();
  let location = useLocation();
  const [docToUse, setDocToUse] = useState(undefined);

  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - dynamicTopBarBottomBarHeight)));
  })

  useEffect(() => {
    setHeight((window.innerHeight - dynamicTopBarBottomBarHeight));
  }, [drawerOpen])

  validateContent(lookerContent[0], schema)

  useEffect(() => {
    let params = queryString.parse(location.search);
    let paramMatchesPDFUrl = params.pdf_url ? true : false;


    if (paramMatchesPDFUrl) {
      // setDocToUse(params["pdf_url"]);
      fetchData({ initialUrl: params["pdf_url"] })
    } else fetchData({ initialUrl: lookerContent[0].url })


  }, [location.search])

  const fetchData = async ({ initialUrl }) => {

    const storageUrl = new URL(initialUrl);
    const { pathname } = storageUrl;
    let bucketName = pathname.split('/')[1];
    let fileName = pathname.split('/')[2];

    let cloudStorageUrlResponse = await fetch('/signedcloudstorageurl', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bucketName, fileName })
    })

    const cloudStorageUrlResponseData = await cloudStorageUrlResponse.json();
    const { signedUrl } = cloudStorageUrlResponseData;
    setDocToUse(signedUrl)
  }


  return (
    <div
      className={`${classes.root} ${classes.positionRelative}`}
      style={{ height }}
    >
      <Card elevation={1}
        className={`${classes.height100Percent} 
      ${classes.overflowScroll}`}
      >
        <Grid
          container
          spacing={3}
          key={validIdHelper(type)}>

          <Loader
            hide={iFrameExists}
            classes={classes}
            height={height} />

          <CodeFlyout
            classes={classes}
            lookerUser={lookerUser}
            height={height}
            staticContent={staticContent}
          />

          {docToUse ?

            <Grid item
              sm
            >
              <Box className={`${classes.w100} `}>
                <object data={docToUse}
                  type="application/pdf"
                  className={`${classes.height800} ${classes.w100}  object`}
                // style={{ height }}
                />
              </Box>
            </Grid > : "Not working"}
        </Grid >
      </Card >
    </div >
  )
}