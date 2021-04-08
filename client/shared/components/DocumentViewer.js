import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Card } from '@material-ui/core'
import { Loader, CodeFlyout } from '@pbl-demo/components/Accessories'
import { useStyles, topBarBottomBarHeight, additionalHeightForFlyout } from './styles.js';
import { useLocation } from "react-router-dom";
import queryString from 'query-string';

const { validIdHelper, appContextMap, validateContent } = require('../utils/tools');

export const DocumentViewer = (props) => {
  const dynamicTopBarBottomBarHeight = process.env.REACT_APP_PACKAGE_NAME === "vision" ? 0 : topBarBottomBarHeight;

  const [iFrameExists, setIFrame] = useState(1);
  const [height, setHeight] = useState((window.innerHeight - dynamicTopBarBottomBarHeight));
  const { clientSession: { lookerUser, lookerHost } } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const { staticContent: { lookerContent, type, schema } } = props;
  const demoComponentType = type;
  const classes = useStyles();
  let location = useLocation();
  const [docToUse, setDocToUse] = useState(lookerContent[0].url);

  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - dynamicTopBarBottomBarHeight)));
  }, [lookerContent]);

  validateContent(lookerContent[0], schema)

  useEffect(() => {
    let params = queryString.parse(location.search);
    let paramMatchesPDFUrl = params.pdf_url ? true : false;

    console.log({ params })
    console.log({ paramMatchesPDFUrl })

    if (paramMatchesPDFUrl) {
      setDocToUse(params["pdf_url"]);
    }

  }, [location.search])


  console.log({ docToUse })
  console.log({ height })

  return (
    <div className={`${classes.root} ${classes.positionRelative}`}
      style={{ height }}
    >
      <Card elevation={1}
        className={` ${classes.height100Percent} ${classes.padding5}`}

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
            height={height - additionalHeightForFlyout}
          />
          {docToUse ?

            <Grid item
              sm
            >
              <Box className={`${classes.w100} `}>
                <object data={docToUse}
                  type="application/pdf"
                  className={`${classes.height800} ${classes.w100}  object`}
                  style={{ height }}
                />
              </Box>
            </Grid > : "Not working"}
        </Grid >
      </Card >
    </div >
  )
}