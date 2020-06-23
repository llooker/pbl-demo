//imports
import $ from 'jquery';
import _ from 'lodash'
import React, { useState, useEffect } from 'react';
import { AppBar, Tabs, Tab, Typography, Box, Grid, CircularProgress, Card, Divider } from '@material-ui/core'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import CodeFlyout from '../CodeFlyout';
import useStyles from './styles.js';
import { TabPanel, a11yProps } from './helpers.js';
import rawSampleCode from '!!raw-loader!./SplashPage.js'; // eslint-disable-line import/no-webpack-loader-syntax
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
  const { staticContent, staticContent: { lookerContent }, staticContent: { type }, handleTabChange, lookerUser, handleDrawerTabChange } = props;
  const codeTab = {
    type: 'sample code', label: 'Code', id: 'codeFlyout',
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
   * What this function does:
   * iterate over Looker Content array mentioned above and
   * calls specific endpoints and methods available from Looker Node SDK
   * and embed SDK to create the experience on this page
   */
  const performLookerApiCalls = function (lookerContent) {
    lookerContent.map(async lookerContent => {
      if (lookerContent.type === 'look') { //embed look
        LookerEmbedSDK.createLookWithId(lookerContent.id)
          .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`))
          .withClassName('look')
          .withClassName(lookerContent.id)
          .build()
          .connect()
          .catch((error) => {
            console.error('Connection error', error)
          })
      } else if (lookerContent.type === 'thumbnail') { //call thumbnail api and append to appropriate container
        let lookerResponse = await fetch(`/getthumbnail/${lookerContent.resourceType}/${lookerContent.id}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
        let lookerResponseData = await lookerResponse.json();
        $(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`)).append(lookerResponseData.svg)
        if (serverSideCode.length === 0) setServerSideCode(lookerResponseData.code);
      }
    })
  }

  //listen for lookerContent and call performLookerApiCalls and setSampleCode
  useEffect(() => {
    performLookerApiCalls([...lookerContent])
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
                    className={item.type === 'sample code' ? `${classes.mlAuto}` : ``}
                    {...a11yProps(index)} />
                ))}
              </Tabs>
            </AppBar>
            <Box className="tabPanelContainer">
              {tabContent.map((tabContentItem, index) => (
                <TabPanel
                  key={`${validIdHelper(demoComponentType + '-tabPanel-' + index)}`}
                  value={value}
                  index={index}>
                  <Grid container>
                    {tabContentItem.type === 'sample code' ?
                      <CodeTab {...props}
                        classes={classes}
                        lookerContent={lookerContent}
                        clientSideCode={clientSideCode}
                        serverSideCode={serverSideCode}
                        lookerUser={lookerUser} />

                      :
                      <React.Fragment
                        key={`${validIdHelper(demoComponentType + '-outerFragment-' + index)}`}>
                        <Grid item sm={6}>
                          <Typography variant="h5" component="h2" className={classes.gridTitle}>
                            Welcome {lookerUser.user_attributes.brand}!<br />
                          </Typography>
                          <br />
                          <Typography variant="h5" component="h5" className={classes.gridTitle}>
                            {staticContent.description}<br />
                          </Typography>
                        </Grid>
                        {tabContentItem.map((lookerContent, innerIndex) => (
                          <React.Fragment
                            key={`${validIdHelper(demoComponentType + '-innerFragment-' + innerIndex)}`}>
                            {innerIndex === 1 ? <Grid item sm={12}><Divider className={`${classes.mt30} ${classes.mb30}`} /></Grid> : ''}
                            <Grid
                              item
                              sm={parseInt(lookerContent.gridWidth)}
                              id={validIdHelper(`gridItem-${demoComponentType}-${lookerContent.id}`)}
                              key={validIdHelper(`gridItem-${demoComponentType}-${lookerContent.id}`)}
                            >
                              <div
                                className={`embedContainer ${classes.maxHeight200} ${classes.textCenter} ${classes.cursor}`}
                                id={validIdHelper(`embedContainer-${demoComponentType}-${lookerContent.id}`)}
                                key={validIdHelper(`embedContainer-${demoComponentType}-${lookerContent.id}`)}
                                onClick={innerIndex > 0 ? (e) => handleDrawerTabChange(e, innerIndex) : undefined}
                              >
                                <Typography variant="h5" component="h5" className={classes.gridTitle} align="center">
                                  {lookerContent.label}<br />
                                </Typography>
                                <br />
                              </div>
                            </Grid>
                          </React.Fragment>
                        )
                        )}
                      </React.Fragment>
                    }
                  </Grid>
                </TabPanel>
              ))}
            </Box>
          </Box >
        </div >
      </Grid >
    </div >
  )
}

//helper function for rendering content in code tab
function CodeTab(props) {
  const { classes, lookerContent, clientSideCode, serverSideCode, lookerUser } = props
  return (
    <Grid item sm={12} >
      <Typography variant="h5" component="h2" className={classes.gridTitle}>
        Looker Content on Page<br />
      </Typography>
      <CodeFlyout code={lookerContent} />
      <Typography variant="h5" component="h2" className={classes.gridTitle}>
        Client Side Code<br />
      </Typography>
      <CodeFlyout code={clientSideCode} />
      <Typography variant="h5" component="h2" className={classes.gridTitle}>
        Server Side Code<br />
      </Typography>
      <CodeFlyout code={serverSideCode} />
      <Typography variant="h5" component="h2" className={classes.gridTitle}>
        Looker User<br />
      </Typography>
      <CodeFlyout code={lookerUser} />
    </Grid>
  )
}