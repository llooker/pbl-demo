import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Card } from '@material-ui/core'
import { Loader, CodeFlyout } from '@pbl-demo/components/Accessories'
import { Document, Page, pdfjs } from 'react-pdf'; //'react-pdf/dist/esm/entry.webpack';
//don't ask me about this next line, see here: 
//https://github.com/wojtekmaj/react-pdf/issues/97#issuecomment-585547230
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import { useStyles, topBarBottomBarHeight } from './styles.js';
const { validIdHelper, appContextMap } = require('../utils/tools');


export const ApplicationViewer = (props) => {
  const [iFrameExists, setIFrame] = useState(1);
  const [height, setHeight] = useState((window.innerHeight - topBarBottomBarHeight));
  const { clientSession: { lookerUser, lookerHost } } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const { staticContent: { lookerContent }, staticContent: { type } } = props;
  const demoComponentType = type;
  const classes = useStyles();

  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - topBarBottomBarHeight)));
  }, [lookerContent]);

  console.log({ lookerContent })

  return (
    <div className={`${classes.root} demoComponent`}
      style={{ height }}>
      <Card elevation={1}
        className={`${classes.padding30} ${classes.height100Percent} ${classes.overflowScroll}`}
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
                  height={height}
                />
                <h1>I'm the new PDF Viewer demo component</h1>

                <Document
                  file={lookerContent[0].pdf}
                // file="https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf"
                >
                  <Page pageNumber={1} />
                </Document>
              </Grid>
            </Box >
          </div >
        </Grid >
      </Card >
    </div >
  )
}