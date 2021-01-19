import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Card } from '@material-ui/core'
// import useStyles from './styles.js';
import { useStyles, topBarBottomBarHeight } from './styles.js';
import AppContext from '../../../contexts/AppContext';
import { Loader, CodeFlyout } from '@pbl-demo/components/Accessories'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import samplePDF from './sample.pdf';


const { validIdHelper } = require('../../../tools');

export default function ApplicationViewer(props) {

  // const topBarBottomBarHeight = 112;
  const [iFrameExists, setIFrame] = useState(1);
  const [height, setHeight] = useState((window.innerHeight - topBarBottomBarHeight));

  const { clientSession, codeShow } = useContext(AppContext)
  const { lookerUser, lookerHost } = clientSession

  const classes = useStyles();
  const { staticContent, staticContent: { lookerContent }, staticContent: { type } } = props;
  const codeTab = {
    type: 'code flyout',
    label: 'Code',
    id: 'codeFlyout',
    lookerContent,
    lookerUser
  }
  const demoComponentType = type || 'code flyout';

  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - topBarBottomBarHeight)));
  }, [lookerContent]);


  return (
    <div className={`${classes.root} demoComponent`}
      style={{ height }}>
      <Card elevation={1} className={`${classes.padding30} 
      ${classes.height100Percent}
      ${classes.overflowScroll}`}
      >
        <Grid container
          key={validIdHelper(type)}>
          <div className={classes.root}>
            {iFrameExists ? '' :
              <Loader classes={classes} height={height} />
            }
            <Box className={iFrameExists ? `` : `${classes.hidden}`}>
              <Grid container
                spacing={3}
                key={`${validIdHelper(demoComponentType + '-outerFragment')}`}
                className={`${classes.noContainerScroll}`}
              >
                {
                  codeShow ? <Grid item sm={6}
                    className={`${classes.positionFixedTopRight}`}
                  >
                    <CodeFlyout {...props}
                      classes={classes}
                      lookerUser={lookerUser}
                      height={height}
                    />
                  </Grid> : ''}
                <h1>I'm the new PDF Viewer demo component</h1>

                <Document
                  file={samplePDF}
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