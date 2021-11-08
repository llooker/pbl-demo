import $ from 'jquery';
import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Tabs, Tab, Box, Grid, Card } from '@material-ui/core'
import { Lock, Add } from '@material-ui/icons';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { TabPanel } from './helpers.js';
import { appContextMap, validIdHelper } from "../../utils/tools";
import { Loader, ApiHighlight, EmbedHighlight, CodeFlyout } from "../Accessories";
import { useStyles, topBarBottomBarHeight, additionalHeightForFlyout } from '../styles.js';
import { TreeSideBar } from './TreeSideBar'

//start of ReportBuilder Component
export function ReportBuilder(props) {
  const { clientSession, setPaywallModal, show, codeShow, sdk, corsApiCall, isReady } = useContext(
    appContextMap[process.env.REACT_APP_PACKAGE_NAME]
  )
  const { userProfile, lookerUser, lookerHost } = clientSession;

  const dynamicTopBarBottomBarHeight = process.env.REACT_APP_PACKAGE_NAME === "vision" ? 0 : topBarBottomBarHeight;
  const [iFrameExists, setIFrame] = useState(0);
  const [showLoader, setShowLoader] = useState(0);
  const [apiContent, setApiContent] = useState([]);
  const [exploreObj, setExploreObj] = useState({});
  const [height, setHeight] = useState((window.innerHeight - dynamicTopBarBottomBarHeight));
  const [expansionPanelHeight, setExpansionPanelHeight] = useState(0);
  const [exploreMode, setExploreMode] = useState(0);

  const classes = useStyles();
 
  const [qid, setQid] = useState(null);
  const { staticContent, staticContent: { lookerContent }, staticContent: { type } } = props;

  const demoComponentType = type;
  const tabContent = [...lookerContent]

  const handleChange = (event, newMode) => {
    if (newMode == 1 && lookerUser.user_attributes.permission_level !== 'premium') {
      setPaywallModal({
        'show': true,
        'permissionNeeded': 'explore'
      });
    } else {
      setExploreMode(newMode)
    }
  };

  useEffect(() => {
    if (isReady) {
      const newMode = !exploreMode;
      corsApiCall(performLookerApiCalls, [lookerContent, newMode])
    }
  }, [lookerUser, exploreMode, isReady]);

  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - dynamicTopBarBottomBarHeight)));
    setExpansionPanelHeight($('.MuiExpansionPanel-root:visible').innerHeight() || 0)
  })

  const action = async (contentType, contentId, secondaryAction, qid, exploreId, newReportEmbedContainer) => {
    // console.log("action");
    // console.log({ contentType })
    // console.log({ contentId })
    // console.log({ qid })

    if (secondaryAction === 'edit' || secondaryAction === 'explore') {
      if(!qid) {
        // if there is no qid, the look needs to be loaded first
        corsApiCall(performLookerApiCalls, [lookerContent, 0, contentId, contentType, 1])
        setIFrame(0)
      } else {
        // save qid to state and use in perform looker api call
        setQid(qid);
        handleChange('edit', 1)
      }
    } else if (secondaryAction === 'delete') {

      let lookerResponse = await sdk.ok(sdk.delete_look(contentId));
      corsApiCall(performLookerApiCalls, [lookerContent, 1])
    } else {
      // default is to load a specific piece of content
      corsApiCall(performLookerApiCalls, [lookerContent, 0, contentId, contentType])
    }
  }

  //TODO: seperate Look loading logic from the dashboard + explore loading logic
  const performLookerApiCalls = function (lookerContent, animateLoad, contentId, contentType, callbackExplore) {
    // console.log("performLookerApiCalls")
    // console.log({ lookerContent })
    // console.log({ animateLoad })
    let selectedLookQid = null

    // clear iFrame
    $(`.embedContainer.${validIdHelper(demoComponentType)}:visible`).html('')
    setShowLoader(1)

    // set default report object
    const contentMetadata = {
      type: contentType ? contentType : "report", 
      id: contentId ? contentId : null,
    }

    if (animateLoad) {
      handleChange('refresh', 0)
      setIFrame(0)
      setApiContent([])
    }

    // if it's a collection of saved reports
    lookerContent.map(async lookerContent => {
      if (exploreMode === 0 &&
        lookerContent.type === 'folder') {

        const sharedFolder = await sdk.ok(sdk.folder(lookerContent.id));
        const embedUser = await sdk.ok(sdk.me())

        for (let h = 0; h < sharedFolder.looks.length; h++) {
          // set to a default look if there isn't one
          if (!contentMetadata.id) contentMetadata.id = sharedFolder.looks[h].id
              
          // only lookup the selected look
          if(contentMetadata.id === sharedFolder.looks[h].id) {
            let look = await sdk.ok(sdk.look(sharedFolder.looks[h].id))
            let clientId = look.query.client_id;
            sharedFolder.looks[h].client_id = clientId;
            selectedLookQid = clientId;
          }
        }

        let embeddedUserFolder = {}
        if (lookerUser.user_attributes.permission_level === 'premium') {
          let embedUserLooks = await sdk.ok(sdk.search_looks({ user_id: embedUser.id }))
          if (embedUserLooks && embedUserLooks.length) {
            let embedUserFolderId = embedUserLooks[0].folder_id || null;
            embeddedUserFolder = await sdk.ok(sdk.folder(embedUserFolderId));
            for (let i = 0; i < embeddedUserFolder.looks.length; i++) {
              // set a default look if there isn't one
              if (!contentMetadata.id) contentMetadata.id = embeddedUserFolder.looks[i].id
              
              // only lookup the selected look
              if(contentMetadata.id === embeddedUserFolder.looks[i].id) {
                let look = await sdk.ok(sdk.look(embeddedUserFolder.looks[i].id));
                let clientId = look.query.client_id;
                embeddedUserFolder.looks[i].client_id = clientId;
                selectedLookQid = clientId;
              }
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

        if (callbackExplore) return action(contentType, contentId, 'explore', selectedLookQid);

        if (objToUse.reports.length && !callbackExplore) {
          objToUse.reports.map((item, index) => {
            let lookId = item.id;

            if (lookId === contentMetadata.id) {
              LookerEmbedSDK.createLookWithId(lookId)
                .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`))
                .withClassName('iframe')
                .withClassName('report')
                .withClassName('look')
                .withClassName(lookerResponseData.sharedFolder.looks.indexOf(item) > -1 ? "shared" : "personal")
                .withClassName(lookId)
                .build()
                .connect()
                .then((look) => {
                  let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
                  LookerEmbedSDK.init(modifiedBaseUrl)
                  setShowLoader(0)
                  setIFrame(1)
                })
                .catch((error) => {
                  console.error('Connection error', error)
                })
            }
          })
        }

        if (objToUse.dashboards.length && !callbackExplore) {
          objToUse.dashboards.map((item, index) => {
            let dashboardId = item.id

            if (dashboardId === contentMetadata.id) {
              LookerEmbedSDK.createDashboardWithId(dashboardId)
                .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`))
                .withClassName('iframe')
                .withClassName('dashboard')
                .withClassName(lookerResponseData.sharedFolder.dashboards.indexOf(item) > -1 ? "shared" : "personal")
                .withClassName(dashboardId)
                .build()
                .connect()
                .then((dashboard) => {
                  setShowLoader(0)
                  setIFrame(1)
                  let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
                  LookerEmbedSDK.init(modifiedBaseUrl)

                })
                .catch((error) => {
                  console.error('Connection error', error)
                })
            }
          })
        }
        setApiContent(objToUse)
      } else if (lookerContent.type === 'explore' &&

        // or it's an explore
        lookerUser.user_attributes.permission_level === 'premium' &&
        exploreMode === 1) {
        
        let exploreId = lookerContent.id;
        $(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`)).html('');
        // separate logic for embedding explore with qid vs. no qid
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
              setShowLoader(0)
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
              setShowLoader(0)
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
    <div className={`${classes.root} ${classes.positionRelative}`}
      style={{ height }}
    >
      <Card elevation={1} className={`${classes.padding15} ${classes.height100Percent} ${classes.overflowYScroll}`}>
        <Grid container
          key={validIdHelper(type)} >
          <div className={classes.root}>
            <Loader
              hide={iFrameExists}
              classes={classes}
              height={height - expansionPanelHeight}
            />
            <Box>
              <AppBar position="static" elevation={0}>
                <Tabs
                  className={classes.tabs}
                  value={exploreMode}
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

                  <CodeFlyout
                    classes={classes}
                    lookerUser={lookerUser}
                    height={height - expansionPanelHeight - additionalHeightForFlyout}
                    staticContent={staticContent}
                  />
                  {tabContent.map((tabContentItem, tabContentItemIndex) => (
                    <TabPanel
                      key={`${validIdHelper(demoComponentType + '-tabPanel-' + tabContentItemIndex)}`}
                      value={exploreMode}
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
                                <Loader
                                  hide={!showLoader}
                                  classes={classes}
                                  height={height - expansionPanelHeight}
                                />
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
                              <Loader
                                hide={!showLoader}
                                classes={classes}
                                height={height - expansionPanelHeight}
                              />
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
