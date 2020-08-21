//imports
import $ from 'jquery';
import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Tabs, Tab, Typography, Box, Grid, CircularProgress, Card, Divider } from '@material-ui/core'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import CodeFlyout from '../CodeFlyout';
import rawSampleCode from '!!raw-loader!./SplashPage.js'; // eslint-disable-line import/no-webpack-loader-syntax
import useStyles from './styles.js';
import { TabPanel, a11yProps } from './helpers.js';
import { SingleValueVis } from './SingleValueVis';
import { Welcome } from './Welcome';
import { PopularAnalysis } from './PopularAnalysis';
import { EmbeddedLook } from './EmbeddedLook';
import { EmbeddedDashboard } from './EmbeddedDashboard';
import { ContentCarousel } from './ContentCarousel';
import BottomBar from '../../Material/BottomBar.js'
import AppContext from '../../../AppContext';
const { validIdHelper } = require('../../../tools');

//start of SplashPage Component
export default function SplashPage(props) {
  // console.log('SplashPage')
  //intialize state using hooks
  const [value, setValue] = useState(0);
  const [iFrameExists, setIFrame] = useState(1);
  const [clientSideCode, setClientSideCode] = useState('');
  const [serverSideCode, setServerSideCode] = useState('');
  const { toggleShow } = useContext(AppContext)
  const { show } = useContext(AppContext)
  const { codeShow } = useContext(AppContext)

  //declare constants
  const classes = useStyles();
  const { staticContent, staticContent: { lookerContent }, staticContent: { type }, handleTabChange, handleMenuItemSelect, lookerUser, lookerHost } = props;
  const codeTab = {
    type: 'code flyout', label: 'Code', id: 'codeFlyout',
    lookerContent, lookerUser, clientSideCode, serverSideCode
  }
  // const tabContent = [[...lookerContent], codeTab];
  // const tabContent = [[...lookerContent]];
  const demoComponentType = type || 'code flyout';

  //handle tab change
  const handleChange = (event, newValue) => {
    handleTabChange(0);
    setValue(newValue);
  };

  /**
   * listen for lookerContent and call 
   * setSampleCode
  */
  // useEffect(() => {
  //   // console.log('useEffect')
  //   // setClientSideCode(rawSampleCode)
  // }, [lookerContent]);


  /**
   * What this return  does:
   * Rendering of actual html elements,
   * this section is necessary but less relevant to looker functionality itself
   */
  return (
    <div className={`${classes.root} ${classes.minHeight680}   demoComponent`}>
      <Card elevation={1} className={`${classes.padding30} `}>
        <Grid container
          spacing={3}
          key={validIdHelper(type)} >
          <div className={classes.root}>
            {iFrameExists ? '' :
              <Grid item sm={12} >
                <Card className={`${classes.card} ${classes.flexCentered}`}>
                  <CircularProgress className={classes.circularProgress} />
                </Card>
              </Grid>
            }
            <Box className={iFrameExists ? `${classes.positionRelative}` : `${classes.hidden} ${classes.positionRelative}`}>
              <Grid container
                spacing={3}
                key={`${validIdHelper(demoComponentType + '-outerFragment')}`}>
                {codeShow ? <Grid item sm={6}
                  className={`${classes.positionTopRight}`}
                >
                  <CodeFlyout {...props}
                    classes={classes}
                    lookerUser={lookerUser} />
                </Grid> : ''}
                {lookerContent.map((lookerContent, innerIndex) => {
                  return (
                    <Grid
                      key={`${validIdHelper(demoComponentType + '-innerFragment-' + innerIndex)}`}
                      item
                      sm={parseInt(lookerContent.gridWidth)}
                    >
                      {(lookerContent.type === 'welcome') && <Welcome
                        {...{ lookerContent, classes, demoComponentType, lookerHost }}
                      />}
                      {(lookerContent.type === 'carousel') && <ContentCarousel
                        {...{ lookerContent, classes, demoComponentType, lookerHost }}
                      />}
                      {(lookerContent.type === 'single value') && <SingleValueVis
                        {...{ lookerContent, classes, demoComponentType, lookerHost }}
                      />}
                      {(lookerContent.type === 'dashboard') && <EmbeddedDashboard
                        {...{ lookerContent, classes, lookerHost }} id={validIdHelper(`embedContainer-${demoComponentType}-${lookerContent.id}`)}
                      />}
                      {(lookerContent.type === 'popular analysis') && <PopularAnalysis
                        {...{ lookerContent, classes, demoComponentType, handleMenuItemSelect, lookerHost }}
                      />}
                    </Grid>
                  )
                })}
              </Grid>
            </Box >
          </div >
        </Grid >
      </Card>
    </div >
  )
}