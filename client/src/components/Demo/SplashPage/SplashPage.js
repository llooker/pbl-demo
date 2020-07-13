//imports
import $ from 'jquery';
import _ from 'lodash'
import React, { useState, useEffect } from 'react';
import { AppBar, Tabs, Tab, Typography, Box, Grid, CircularProgress, Card, Divider } from '@material-ui/core'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import CodeFlyout from '../CodeFlyout';
import rawSampleCode from '!!raw-loader!./SplashPage.js'; // eslint-disable-line import/no-webpack-loader-syntax
import useStyles from './styles.js';
import { TabPanel, a11yProps } from './helpers.js';
import { SplashThumbnail } from './SplashThumbnail';
import { SingleValueVis } from './SingleValueVis';
import { SplashLook } from './SplashLook';
const { validIdHelper } = require('../../../tools');

//start of SplashPage Component
export default function SplashPage(props) {
  //intialize state using hooks
  const [value, setValue] = useState(0);
  const [iFrameExists, setIFrame] = useState(1);
  const [clientSideCode, setClientSideCode] = useState('');
  const [serverSideCode, setServerSideCode] = useState('');

  //declare constants
  const classes = useStyles();
  const { staticContent, staticContent: { lookerContent }, staticContent: { type }, handleTabChange, lookerUser, handleMenuItemSelect } = props;
  const codeTab = {
    type: 'code flyout', label: 'Code', id: 'codeFlyout',
    lookerContent, lookerUser, clientSideCode, serverSideCode
  }
  const tabContent = [[...lookerContent], codeTab];
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
  useEffect(() => {
    setClientSideCode(rawSampleCode)
  }, [lookerContent]);


  /**
   * What this return  does:
   * Rendering of actual html elements,
   * this section is necessary but less relevant to looker functionality itself
   */
  return (
    <div className={`${classes.root} demoComponent`}>
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
          <Box className={iFrameExists ? `` : `${classes.hidden}`}>
            <AppBar position="static">
              <Tabs
                className={classes.tabs}
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example">
                {tabContent.map((item, index) => (
                  <Tab
                    key={`${validIdHelper(demoComponentType + '-tab-' + index)}`}
                    label={item.label ? item.label : 'At a glance'}
                    className={item.type === 'code flyout' ? `${classes.mlAuto}` : ``}
                    {...a11yProps(index)} />
                ))}
              </Tabs>
            </AppBar>
            <Box className="tabPanelContainer">
              {tabContent.map((tabContentItem, index) => {
                return <TabPanel
                  key={`${validIdHelper(demoComponentType + '-tabPanel-' + index)}`}
                  value={value}
                  index={index}>
                  <Grid container>
                    {tabContentItem.type === 'code flyout' ?
                      <CodeFlyout {...props}
                        classes={classes}
                        lookerContent={lookerContent}
                        clientSideCode={clientSideCode}
                        serverSideCode={serverSideCode}
                        lookerUser={lookerUser} />
                      :
                      <React.Fragment
                        key={`${validIdHelper(demoComponentType + '-outerFragment-' + index)}`}>
                        {/* <Grid item sm={6}>
                          <Typography variant="h5" component="h2" className={classes.gridTitle}>
                            Welcome {lookerUser.user_attributes.brand}!<br />
                          </Typography>
                          <br />
                          <Typography variant="h5" component="h5" className={classes.gridTitle}>
                            {staticContent.description}<br />
                          </Typography>
                        </Grid> */}
                        {/* {tabContentItem.map((lookerContent, innerIndex) => {
                          return <React.Fragment
                            key={`${validIdHelper(demoComponentType + '-innerFragment-' + innerIndex)}`}>
                            {innerIndex === 1 ? <Grid item sm={12}><Divider className={`${classes.mt30} ${classes.mb30}`} /></Grid> : ''}
                            <Grid
                              item
                              sm={parseInt(lookerContent.gridWidth)}
                              id={validIdHelper(`gridItem-${demoComponentType}-${lookerContent.id}`)}
                              key={validIdHelper(`gridItem-${demoComponentType}-${lookerContent.id}`)}
                            >
                              {(lookerContent.type === 'thumbnail') && <SplashThumbnail
                                {...{ lookerContent, classes, demoComponentType }}
                                onClick={innerIndex > 0 ? () => handleMenuItemSelect(lookerContent.id, 1) : undefined}
                              />}
                              {(lookerContent.type === 'look') && <SplashLook {...{ lookerContent, classes }} id={validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`)} />}
                            </Grid>
                          </React.Fragment>
                        })} */}
                        {tabContentItem.map((lookerContent, innerIndex) => {
                          return <React.Fragment
                            key={`${validIdHelper(demoComponentType + '-innerFragment-' + innerIndex)}`}>
                            {/* {innerIndex === 1 ? <Grid item sm={12}><Divider className={`${classes.mt30} ${classes.mb30}`} /></Grid> : ''} */}
                            <Grid
                              item
                              sm={parseInt(lookerContent.gridWidth)}
                              style={{ height: lookerContent.height }}
                              className={classes.border}
                            // id={validIdHelper(`gridItem-${demoComponentType}-${lookerContent.id}`)}
                            // key={validIdHelper(`gridItem-${demoComponentType}-${lookerContent.id}`)}
                            >

                              {(lookerContent.type === 'single value vis') && <SingleValueVis
                                {...{ lookerContent, classes, demoComponentType }}
                              />}
                            </Grid>
                          </React.Fragment>
                        })}
                      </React.Fragment>
                    }
                  </Grid>
                </TabPanel>
              })}
            </Box>
          </Box >
        </div >
      </Grid >
    </div >
  )
}