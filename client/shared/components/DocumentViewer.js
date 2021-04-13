import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Card } from '@material-ui/core'
import { Loader, CodeFlyout } from '@pbl-demo/components/Accessories'
import { useLocation } from "react-router-dom";
import queryString from 'query-string';
import { useStyles, topAndBottomHeaderPlusDrawerOpen, topAndBottomHeaderSpacing } from './styles.js';

const { validIdHelper, appContextMap, validateContent } = require('../utils/tools');

export const DocumentViewer = (props) => {
  const { clientSession: { lookerUser, lookerHost }, drawerOpen } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const dynamicTopBarBottomBarHeight = process.env.REACT_APP_PACKAGE_NAME === "vision" ? drawerOpen ? (topAndBottomHeaderPlusDrawerOpen) : (topAndBottomHeaderSpacing) : (topAndBottomHeaderSpacing);


  const [iFrameExists, setIFrame] = useState(1);
  const [height, setHeight] = useState((window.innerHeight - dynamicTopBarBottomBarHeight));
  const { staticContent: { lookerContent, type, schema } } = props;
  const demoComponentType = type;
  const classes = useStyles();
  let location = useLocation();
  const [docToUse, setDocToUse] = useState(lookerContent[0].url);

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
      setDocToUse(params["pdf_url"]);
    }

  }, [location.search])



  return (
    <div
      className={`${classes.root} ${classes.positionRelative}`}
      style={{ height }}
    >
      <Card elevation={1}
        className={classes.height100Percent}
      >
        <Grid
          container
          spacing={3}
          key={validIdHelper(type)}>

          <Loader
            hide={iFrameExists}
            classes={classes}
            height={height} />

          <CodeFlyout {...props}
            classes={classes}
            lookerUser={lookerUser}
            height={height}
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