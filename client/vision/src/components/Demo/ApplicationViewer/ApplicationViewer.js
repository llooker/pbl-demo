import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Card } from '@material-ui/core'
import useStyles from './styles.js';
import AppContext from '../../../contexts/AppContext';
import { Loader, CodeFlyout } from '@pbl-demo/components/Accessories'
import PDFViewer from 'pdf-viewer-reactjs'

const { validIdHelper } = require('../../../tools');

export default function ApplicationViewer(props) {

  const topBarBottomBarHeight = 112;
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
                {/* {lookerContent.map((lookerContentItem, innerIndex) => {
                  // console.log({ lookerContentItem })
                  return (
                    <Grid
                      key={`${validIdHelper(demoComponentType + '-innerFragment-' + innerIndex)}`}
                      item
                      sm={parseInt(lookerContentItem.gridWidth)}
                    >
                      {(lookerContentItem.type === 'welcome') && <Welcome
                        {...{ lookerContentItem, classes }}
                      />}
                      {(lookerContentItem.type === 'single value') && <SingleValueVis
                        {...{ lookerContentItem, classes, demoComponentType, lookerHost }}
                      />}
                      {(lookerContentItem.type === 'embeddedquery') && <EmbeddedQuery
                        {...{ lookerContentItem, classes, lookerHost }} id={validIdHelper(`embedContainer-${demoComponentType}-${lookerContent.id}`)}
                      />}
                      {(lookerContentItem.type === 'popular analysis') && <PopularAnalysis
                        {...{ lookerContentItem, classes, demoComponentType, lookerHost }}
                      />}
                    </Grid>
                  )
                })} */}
                <h1>I'm the new PDF Viewer demo component</h1>
                <PDFViewer
                  document={{
                    url: 'https://arxiv.org/pdf/quant-ph/0410100.pdf',
                  }}
                />
              </Grid>
            </Box >
          </div >
        </Grid >
      </Card >
    </div >
  )
}