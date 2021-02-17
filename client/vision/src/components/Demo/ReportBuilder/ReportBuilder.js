import $ from 'jquery';
import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Tabs, Tab, Box, Grid, Card } from '@material-ui/core'
import { Lock, Add } from '@material-ui/icons';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { TabPanel, a11yProps } from './helpers.js';
import '../../Home.css';
import AppContext from '../../../contexts/AppContext';
import { Loader, ApiHighlight, EmbedHighlight, CodeFlyout } from "@pbl-demo/components/Accessories";
import { useStyles, topBarBottomBarHeight, additionalHeightForFlyout } from '../styles.js';
import { TreeSideBar } from './TreeSideBar'
const { validIdHelper } = require('../../../tools');

//start of ReportBuilder Component
export default function ReportBuilder(props) {

  const { clientSession, setPaywallModal, show, codeShow, sdk, corsApiCall, isReady } = useContext(AppContext)
  const { userProfile, lookerUser, lookerHost } = clientSession;

  const [iFrameExists, setIFrame] = useState(0);
  const [apiContent, setApiContent] = useState([]);
  const [exploreObj, setExploreObj] = useState({});
  const [height, setHeight] = useState((window.innerHeight - topBarBottomBarHeight));
  const [expansionPanelHeight, setExpansionPanelHeight] = useState(0);

  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [qid, setQid] = useState(null);
  const { staticContent, staticContent: { lookerContent }, staticContent: { type } } = props;

  const demoComponentType = type;
  const tabContent = [...lookerContent]

  const handleChange = (event, newValue) => {
    if (newValue == 1 && lookerUser.user_attributes.permission_level !== 'premium') {
      // handleChange(0)
      setPaywallModal({
        'show': true,
        'permissionNeeded': 'explore'
      });
    } else {
      setValue(newValue)
    }
  };

  useEffect(() => {
    if (isReady) {
      corsApiCall(performLookerApiCalls, [lookerContent, !value])
    }
  }, [lookerUser, value, isReady, value]);

  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - topBarBottomBarHeight)));
    setExpansionPanelHeight($('.MuiExpansionPanel-root:visible').innerHeight() || 0)
  })


  const action = async (contentType, contentId, secondaryAction, qid, exploreId, newReportEmbedContainer) => {
    // console.log("action");
    // console.log({ contentType })
    // console.log({ contentId })
    // console.log({ qid })
    let iFrameArray = $(".embedContainer:visible > iframe");

    let matchingIndex = 0;
    for (let i = 0; i < iFrameArray.length; i++) {
      if (iFrameArray[i].classList.contains(contentType) && iFrameArray[i].classList.contains(contentId)) {
        iFrameArray[i].classList.remove('dNone')
        matchingIndex = i;
      } else {
        iFrameArray[i].classList.add('dNone')
      }
    }

    if (secondaryAction === 'edit' || secondaryAction === 'explore') {
      //save qid to state and use in perform looker api calls
      setQid(qid);
      handleChange('edit', 1)
    } else if (secondaryAction === 'delete') {

      let lookerResponse = await sdk.ok(sdk.delete_look(contentId));
      corsApiCall(performLookerApiCalls, [lookerContent, 1])
    }
  }

  const performLookerApiCalls = function (lookerContent, animateLoad) {
    // console.log("performLookerApiCalls")
    // console.log({ lookerContent })
    // console.log({ animateLoad })

    $(`.embedContainer.${validIdHelper(demoComponentType)}:visible`).html('')

    if (animateLoad) {
      handleChange('refresh', 0)
      setIFrame(0)
      setApiContent([])
    }

    lookerContent.map(async lookerContent => {
      if (value === 0 &&
        lookerContent.type === 'folder') {

        const sharedFolder = await sdk.ok(sdk.folder(lookerContent.id));
        const embedUser = await sdk.ok(sdk.me())

        for (let h = 0; h < sharedFolder.looks.length; h++) {
          let look = await sdk.ok(sdk.look(sharedFolder.looks[h].id))
          let clientId = look.query.client_id;
          sharedFolder.looks[h].client_id = clientId;
        }

        let embeddedUserFolder = {}
        if (lookerUser.user_attributes.permission_level === 'premium') {
          let embedUserLooks = await sdk.ok(sdk.search_looks({ user_id: embedUser.id }))
          if (embedUserLooks && embedUserLooks.length) {
            let embedUserFolderId = embedUserLooks[0].folder_id || null;
            embeddedUserFolder = await sdk.ok(sdk.folder(embedUserFolderId));
            for (let i = 0; i < embeddedUserFolder.looks.length; i++) {
              let look = await sdk.ok(sdk.look(embeddedUserFolder.looks[i].id));
              let clientId = look.query.client_id;
              embeddedUserFolder.looks[i].client_id = clientId;
            }
          }
        }

        let lookerResponseData = {
          sharedFolder,
          embeddedUserFolder
        }

        let looksToUse = [...lookerResponseData.sharedFolder.looks];
        if (lookerUser.user_attributes.permission_level === 'premium' &&
          Object.keys(lookerResponseData.embeddedUserFolder).length) {
          looksToUse = [
            ...looksToUse, ...lookerResponseData.embeddedUserFolder.looks
          ]

        }
        let dashboardsToUse = [...lookerResponseData.sharedFolder.dashboards]
        let objToUse = {
          reports: looksToUse,
          dashboards: dashboardsToUse
        }
        let iFrameArray = $(`.embedContainer.${validIdHelper(demoComponentType)} > iframe`);
        if (objToUse.reports.length) {
          objToUse.reports.map((item, index) => {

            let lookId = item.id;
            let lookIsRendered = false;
            for (let i = 0; i < iFrameArray.length; i++) {
              if (iFrameArray[i].classList.contains('look') && iFrameArray[i].classList.contains(lookId)) {
                lookIsRendered = true;
              }
            }

            if (!lookIsRendered) {
              LookerEmbedSDK.createLookWithId(lookId)
                .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`))
                .withClassName('iframe')
                .withClassName('report')
                .withClassName('look')
                .withClassName(lookerResponseData.sharedFolder.looks.indexOf(item) > -1 ? "shared" : "personal")
                .withClassName(index > 0 ? 'dNone' : 'oops')
                .withClassName(lookId)
                .build()
                .connect()
                .then((look) => {
                  let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
                  LookerEmbedSDK.init(modifiedBaseUrl)
                })
                .catch((error) => {
                  console.error('Connection error', error)
                })
            }

            if (index === objToUse.reports.length - 1) {
              setTimeout(() => setIFrame(1), 1000)
            }
          })
        }

        if (objToUse.dashboards.length) {
          objToUse.dashboards.map((item, index) => {
            let dashboardId = item.id
            let dashboardIsRendered = false;
            for (let i = 0; i < iFrameArray.length; i++) {
              if (iFrameArray[i].classList.contains('dashboard') && iFrameArray[i].classList.contains(dashboardId)) {
                dashboardIsRendered = true;
              }
            }
            if (!dashboardIsRendered) {
              LookerEmbedSDK.createDashboardWithId(dashboardId)
                .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`))
                .withClassName('iframe')
                .withClassName('dashboard')
                .withClassName(lookerResponseData.sharedFolder.dashboards.indexOf(item) > -1 ? "shared" : "personal")
                .withClassName('dNone')
                .withClassName(dashboardId)
                .build()
                .connect()
                .then((dashboard) => {
                  setTimeout(() => {
                    // setIFrame(1)
                  }, 1000)
                  let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
                  LookerEmbedSDK.init(modifiedBaseUrl)

                })
                .catch((error) => {
                  console.error('Connection error', error)
                })
            }

            if (index === objToUse.dashboards.length - 1) {
              setTimeout(() => setIFrame(1), 1000)
            }
          })
        }
        setApiContent(objToUse)
      } else if (lookerContent.type === 'explore' &&
        lookerUser.user_attributes.permission_level === 'premium' &&
        value === 1) {
        let exploreId = lookerContent.id;
        $(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`)).html('');
        //separate logic for embedding explore with qid vs. no qid
        if (qid) {
          LookerEmbedSDK.createExploreWithId(exploreId)
            .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`))
            .withClassName('exploreIframe')
            .withParams({
              qid: qid
            })
            .on('explore:state:changed', (event) => {
            })
            .build()
            .connect()
            .then((explore) => {
              setIFrame(1)
              setExploreObj(explore)

              let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
              LookerEmbedSDK.init(modifiedBaseUrl)

              setQid(null)
            })
            .catch((error) => {
              console.error('Connection error', error)
            })
        } else {
          LookerEmbedSDK.createExploreWithId(exploreId)
            .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`))
            .withClassName('exploreIframe')
            .on('explore:state:changed', (event) => {
            })
            .build()
            .connect()
            .then((explore) => {
              setIFrame(1)
              setExploreObj(explore)
              let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
              LookerEmbedSDK.init(modifiedBaseUrl)
            })
            .catch((error) => {
              console.error('Connection error', error)
            })
        }
      }
    })
  }

  return (
    <div className={`${classes.root} demoComponent`}
      style={{ height }}>
      <Card elevation={1} className={`${classes.padding15} ${classes.height100Percent} ${classes.overflowYScroll}`}>
        <Grid container
          key={validIdHelper(type)} >
          <div className={classes.root}>
            <Loader
              hide={iFrameExists}
              classes={classes}
              height={height - expansionPanelHeight}
            />
            {/* additional loading logic, need embedContainer to exist but want it hidden until iFrame has content...*/}
            <Box className={iFrameExists ? `` : `${classes.hidden}`}>
              <AppBar position="static" elevation={0}>
                <Tabs
                  className={classes.tabs}
                  value={value}
                  onChange={handleChange}
                  aria-label="simple tabs example"
                // TabIndicatorProps={{ style: { border: "white" } }}
                >
                  {tabContent.map((item, index) => (
                    <Tab
                      key={`${validIdHelper(demoComponentType + '-tab-' + index)}`}
                      className={index === 1 ? classes.mlAuto : ""}
                      label={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {index === 1 ?
                            lookerUser.user_attributes.permission_level != 'premium' ?
                              <Lock className={classes.mr12} />
                              :
                              <Add className={classes.mr12} /> : ""
                          }
                          <span >
                            {item.label}</span>
                        </div>
                      }
                    >
                    </Tab>
                  ))}
                </Tabs>
              </AppBar>
              <Box className="tabPanelContainer">
                <Grid container
                  spacing={3}
                  className={`${classes.noContainerScroll}`}>

                  <CodeFlyout {...props}
                    classes={classes}
                    lookerUser={lookerUser}
                    height={height - expansionPanelHeight - additionalHeightForFlyout}
                  />
                  {tabContent.map((tabContentItem, tabContentItemIndex) => (
                    <TabPanel
                      key={`${validIdHelper(demoComponentType + '-tabPanel-' + tabContentItemIndex)}`}
                      value={value}
                      index={tabContentItemIndex}
                      style={{ width: '100%' }} //weird
                    >
                      <Grid container>
                        {
                          tabContentItemIndex === 0
                            ?
                            <React.Fragment
                              key={`${validIdHelper(demoComponentType + '-outerFragment-' + tabContentItemIndex)}`}>
                              <Grid item sm={4} >
                                <ApiHighlight height={500} classes={classes}>
                                  <TreeSideBar {...{
                                    setPaywallModal,
                                    classes,
                                    demoComponentType,
                                    tabContent,
                                    tabContentItemIndex,
                                    action,
                                    apiContent,
                                    ...props
                                  }}
                                  />
                                </ApiHighlight>
                              </Grid>
                              <Grid item sm={8} >
                                <EmbedHighlight classes={classes}>
                                  <div
                                    className={`embedContainer ${validIdHelper(demoComponentType)}`}
                                    id={validIdHelper(`embedContainer-${demoComponentType}-${tabContentItem.id}`)}
                                    key={validIdHelper(`embedContainer-${demoComponentType}-${tabContentItem.id}`)}
                                  >
                                  </div>
                                </EmbedHighlight>
                              </Grid>
                            </React.Fragment>
                            :
                            <Grid item sm={12} >
                              <EmbedHighlight classes={classes}>
                                <div
                                  className="embedContainer"
                                  id={validIdHelper(`embedContainer-${demoComponentType}-${tabContentItem.id}`)}
                                  key={validIdHelper(`embedContainer-${demoComponentType}-${tabContentItem.id}`)}
                                >
                                </div>
                              </EmbedHighlight>
                            </Grid>
                        }
                      </Grid>
                    </TabPanel>
                  ))}</Grid>
              </Box>
            </Box >
          </div>
        </Grid >
      </Card>
    </div >
  )
}