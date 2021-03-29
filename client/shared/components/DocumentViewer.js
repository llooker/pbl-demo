import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Card } from '@material-ui/core'
import { Loader, CodeFlyout } from '@pbl-demo/components/Accessories'
import { useStyles, topBarBottomBarHeight, additionalHeightForFlyout } from './styles.js';
import { useLocation } from "react-router-dom";
import queryString from 'query-string';

const { validIdHelper, appContextMap, validateContent } = require('../utils/tools');

export const DocumentViewer = (props) => {
  const [iFrameExists, setIFrame] = useState(1);
  const [height, setHeight] = useState((window.innerHeight - topBarBottomBarHeight));
  const { clientSession: { lookerUser, lookerHost } } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const { staticContent: { lookerContent, type, schema } } = props;
  const demoComponentType = type;
  const classes = useStyles();
  let location = useLocation();
  const [docToUse, setDocToUse] = useState(lookerContent[0].url);

  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - topBarBottomBarHeight)));
  }, [lookerContent]);

  validateContent(lookerContent[0], schema)

  useEffect(() => {
    let params = queryString.parse(location.search);
    let paramMatchesPDFUrl = params.pdf_url ? true : false;

    if (paramMatchesPDFUrl) {
      setDocToUse(params["pdf_url"]);
    }

  }, [location.search])

  return (
    <div className={`${classes.root} ${classes.positionRelative}`}
      style={{ height }}
    >
      <Card elevation={1} className={`${classes.padding15} ${classes.height100Percent} ${classes.overflowScroll}`}
      >
        <Grid container
          key={validIdHelper(type)}>
          <div className={classes.root}>

            <Loader
              hide={iFrameExists}
              classes={classes}
              height={height} />

            <Box className={iFrameExists ? `` : `${classes.hidden}`}>
              <Grid container
                spacing={3}
                key={`${validIdHelper(demoComponentType + '-outerFragment')}`}
                className={`${classes.noContainerScroll}`}
              >

                <CodeFlyout {...props}
                  classes={classes}
                  lookerUser={lookerUser}
                  height={height - additionalHeightForFlyout}
                />
                {docToUse ?
                  <object data={docToUse}
                    type="application/pdf"
                    className={`${classes.minHeight680} ${classes.w100} object`} /> : ""}
              </Grid>
            </Box >
          </div >
        </Grid >
      </Card >
    </div >
  )
}