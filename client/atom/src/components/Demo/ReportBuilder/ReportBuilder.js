import $ from 'jquery';
import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Tabs, Tab, Typography, Box, Grid, Icon, CircularProgress, Card, Button } from '@material-ui/core'
import { TreeView, TreeItem } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import CodeFlyout from '../CodeFlyout';
import rawSampleCode from '!!raw-loader!./ReportBuilder.js'; // eslint-disable-line import/no-webpack-loader-syntax
import useStyles from './styles.js';
import { TabPanel, a11yProps } from './helpers.js';
import '../../Home.css';
import AppContext from '../../../contexts/AppContext';
import { Loader, ApiHighlight, EmbedHighlight } from "@pbl-demo/components";
const { validIdHelper } = require('../../../tools');

//start of ReportBuilder Component
export default function ReportBuilder(props) {


  const { clientSession, setPaywallModal, show, codeShow, sdk, corsApiCall, isReady } = useContext(AppContext)
  const { userProfile, lookerUser, lookerHost } = clientSession;

  const topBarBottomBarHeight = 112;
  const [iFrameExists, setIFrame] = useState(0);
  // const [exploreIFrameExists, setExploreIFrame] = useState(0);
  const [apiContent, setApiContent] = useState([]);
  const [exploreObj, setExploreObj] = useState({});
  const [clientSideCode, setClientSideCode] = useState('');
  const [serverSideCode, setServerSideCode] = useState('');
  const [height, setHeight] = useState((window.innerHeight - topBarBottomBarHeight));
  const [expansionPanelHeight, setExpansionPanelHeight] = useState(0);

  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [qid, setQid] = useState(null);
  const { staticContent, staticContent: { lookerContent }, staticContent: { type },
    //activeTabValue, handleTabChange, lookerUser, lookerHost 
  } = props;

  const demoComponentType = type;
  const tabContent = [...lookerContent]

  const handleChange = (event, newValue) => {
    if (newValue == 1 && lookerUser.user_attributes.permission_level != 'premium') {
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
      setClientSideCode(rawSampleCode)
    }
  }, [lookerUser, value, isReady, value]);

  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - topBarBottomBarHeight)));
    setExpansionPanelHeight($('.MuiExpansionPanel-root:visible').innerHeight() || 0)
  })


  const action = async (contentType, contentId, secondaryAction, qid, exploreId, newReportEmbedContainer) => {

    let iFrameArray = $(".embedContainer:visible > iframe")

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
      //remove iframe associated with content that was deleted
      let indexOfDeletedContent;
      for (let i = 0; i < iFrameArray.length; i++) {
        if (iFrameArray[i].classList.contains(contentId)) {
          indexOfDeletedContent = i;
        }
      }
      let updatedIFrameArray = iFrameArray.slice()
      updatedIFrameArray.splice(indexOfDeletedContent, 1)
      for (let i = 0; i < updatedIFrameArray.length; i++) {
        if (i === 0) {
          updatedIFrameArray[i].classList.remove('dNone')
          matchingIndex = i;
        } else {
          updatedIFrameArray[i].classList.add('dNone')
        }
      }
      //append updated array
      $(`#embedContainer-reportbuilder-14`).empty();
      $(`#embedContainer-reportbuilder-14`).html(updatedIFrameArray);

      let lookerResponse = await sdk.ok(sdk.delete_look(contentId));
      corsApiCall(performLookerApiCalls, [lookerContent, 1])
    }
  }

  const performLookerApiCalls = function (lookerContent, animateLoad) {
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

        // console.log('lookerResponseData', lookerResponseData)

        let looksToUse = [...lookerResponseData.sharedFolder.looks];
        if (lookerUser.user_attributes.permission_level === 'premium' &&
          Object.keys(lookerResponseData.embeddedUserFolder).length) {
          looksToUse = [
            ...looksToUse, ...lookerResponseData.embeddedUserFolder.looks
          ]

        }
        let dashboardsToUse = [...lookerResponseData.sharedFolder.dashboards]
        let objToUse = {
          looks: looksToUse,
          dashboards: dashboardsToUse
        }
        // console.log('objToUse', objToUse)
        let iFrameArray = $(`.embedContainer.${validIdHelper(demoComponentType)} > iframe`);
        if (objToUse.looks.length) {
          objToUse.looks.map((item, index) => {

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

            if (index === objToUse.looks.length - 1) {
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
        // console.log('inside else ifff')
        let exploreId = lookerContent.id;
        // console.log('exploreId', exploreId)
        $(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`)).html('');
        //separate logic for embedding explore with qid vs. no qid
        if (qid) {
          // console.log('qid ifff')
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
              console.log('explore', explore)
              // setTimeout(() => {
              setIFrame(1)
              setExploreObj(explore)
              // }, 1000)

              let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
              LookerEmbedSDK.init(modifiedBaseUrl)

              setQid(null)
            })
            .catch((error) => {
              console.error('Connection error', error)
            })
        } else {
          // console.log('qid else')
          LookerEmbedSDK.createExploreWithId(exploreId)
            .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`))
            .withClassName('exploreIframe')
            .on('explore:state:changed', (event) => {
            })
            .build()
            .connect()
            .then((explore) => {
              // console.log('explore', explore)
              // setTimeout(() => {
              setIFrame(1)
              setExploreObj(explore)
              // }, 1000)
              let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
              LookerEmbedSDK.init(modifiedBaseUrl)

              // setQid(null)
            })
            .catch((error) => {
              console.error('Connection error', error)
            })
        }
      }
      // else console.log('ellse')
    })
  }

  return (
    <div className={`${classes.root} demoComponent`}
      style={{ height }}>
      <Card elevation={1} className={`
      ${classes.padding30} 
      ${classes.height100Percent}
      ${classes.overflowYScroll}`
      }
      >
        <Grid container
          key={validIdHelper(type)} >
          <div className={classes.root}>
            {iFrameExists ? '' :

              <Loader classes={classes}
                height={height}
                expansionPanelHeight={expansionPanelHeight} />
            }

            {/* additional loading logic, need embedContainer to exist but want it hidden until iFrame has content...*/}
            <Box className={iFrameExists ? `` : `${classes.hidden}`}>
              <AppBar position="static" elevation={0}>
                <Tabs
                  className={classes.tabs}
                  value={value}
                  onChange={handleChange}
                  aria-label="simple tabs example">
                  {tabContent.map((item, index) => (
                    <Tab
                      key={`${validIdHelper(demoComponentType + '-tab-' + index)}`}
                      label={index == 1 ?
                        <div>

                          {lookerUser.user_attributes.permission_level != 'premium' ?
                            <Icon className={`fa fa-lock ${classes.faSm} ${classes.mr12}`} /> : <Icon className={`fa fa-plus ${classes.faSm} ${classes.mr12}`} />}
                          {item.label}
                        </div> :
                        item.label}
                      className={value === 1 && index === 1 ? `${classes.hidden}` : index == 1 ? `${classes.mlAuto}` : ``}
                      style={index === 1 ? {
                        backgroundColor: '#5896E6',
                        borderRadius: '4px',
                        color: '#fff',
                        opacity: '1.0'
                      } : {}}
                      {...a11yProps(index)} />
                  ))}
                </Tabs>
              </AppBar>
              <Box className="tabPanelContainer">
                <Grid container
                  spacing={3}
                  className={`${classes.noContainerScroll}`}>
                  {codeShow ?
                    <Grid item sm={6}
                      className={`${classes.positionFixedTopRight}`}
                    >
                      <CodeFlyout {...props}
                        classes={classes}
                        lookerUser={lookerUser}
                        height={height}
                      />
                    </Grid> : ''}
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
                              {/* couldn't get this to work */}
                              {/* {Object.keys(exploreObj).length ?
                                <EmbedHighlight classes={classes}>
                                  <div
                                    className="embedContainer"
                                    id={validIdHelper(`embedContainer-${demoComponentType}-${tabContentItem.id}`)}
                                    key={validIdHelper(`embedContainer-${demoComponentType}-${tabContentItem.id}`)}
                                  >
                                  </div>
                                </EmbedHighlight> :
                                <Card className={`${classes.card} ${classes.flexCentered}`}
                                  elevation={0}
                                  mt={2}
                                  style={{ height: height - 30 - ($('.MuiExpansionPanel-root:visible').innerHeight() || 0) }}>
                                  <CircularProgress className={classes.circularProgress} />
                                </Card>} */}
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


function TreeSideBar(props) {


  const { clientSession, setPaywallModal, show, codeShow, sdk, corsApiCall } = useContext(AppContext)
  const { userProfile, lookerUser, lookerHost } = clientSession

  const { staticContent, staticContent: { lookerContent }, classes, demoComponentType, tabContent, tabContentItemIndex, action, apiContent,
    //lookerUser, setPaywallModal
  } = props
  const sharedFolderId = lookerContent[0].type === 'folder' ? lookerContent[0].id : '';
  let treeCounter = 0;
  const [selected, setSelected] = useState(2);
  const expandedArr = Object.keys(apiContent).length ? ["1", "" + (2 + apiContent[Object.keys(apiContent)[0]].length)] : [];
  const [expanded, setExpanded] = useState(expandedArr);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  }

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };


  useEffect(() => {
    setExpanded(expandedArr);
    if (selected !== 2) setSelected(2)
    // let innerTreeItemArray = $(".innerTreeItem");
    // console.log('innerTreeItemArray', innerTreeItemArray)
    // for (let i = 0; i < innerTreeItemArray.length; i++) {
    //   console.log('inside forrr', i)
    //   if (innerTreeItemArray[i].classList.contains('Mui-selected')) {
    //     console.log('inside iffff')
    //     innerTreeItemArray[i].classList.remove('Mui-selected')
    //   } else console.log('elllse')
    // }
  }, [apiContent]);


  return (
    <TreeView
      className={classes.tree}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      onNodeToggle={handleToggle}
      onNodeSelect={handleSelect}
    // multiSelect={false}
    >
      {apiContent ? Object.keys(apiContent).map((key, outerIndex) => (
        <React.Fragment
          key={`${validIdHelper(demoComponentType + '-innerFragment-' + outerIndex)}`}>
          <TreeItem
            key={`${validIdHelper(demoComponentType + '-outerTreeItem-' + outerIndex)}`}
            nodeId={"" + (treeCounter += 1)}
            // treecounter={treeCounter}
            label={_.capitalize(key)}
            icon={<Icon className={`fa fa-folder ${classes.icon}`} />}
            disabled={apiContent[key].length ? false : true}
          >
            {
              apiContent[key].length ?
                apiContent[key].map((item, index) => (
                  <TreeItem
                    key={`${validIdHelper(demoComponentType + '-innerTreeItem-' + treeCounter)}`}
                    nodeId={"" + (treeCounter += 1)}
                    treecounter={treeCounter}
                    selected={selected === treeCounter}
                    className={selected === treeCounter ? `Mui-selected innerTreeItem ${classes.whiteSpaceNoWrap}` : `innerTreeItem ${classes.whiteSpaceNoWrap}`}
                    contentid={item.id}
                    label={item.folder_id === sharedFolderId &&
                      key === 'looks' ?
                      <div
                        id={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                        key={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                        className={`${classes.labelRoot} ${classes.parentHoverVisibility}`}
                      >
                        {/* {item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title} */}
                        <Grid container>
                          <Grid item sm={8} className={`${classes.overflowHidden}`}>
                            {item.title}</Grid>
                          <Grid item sm={4}>
                            <Button
                              id={`${validIdHelper(demoComponentType + '-innerTreeItem-Explore' + treeCounter)}`}
                              key={`${validIdHelper(demoComponentType + '-innerTreeItem-Explore' + treeCounter)}`}
                              size="small"
                              className={`${classes.ml12} ${classes.childHoverVisibility}`}
                              onClick={(event) => {
                                if (lookerUser.user_attributes.permission_level === 'premium') {
                                  action(
                                    key.substring(0, key.length - 1),
                                    item.id,
                                    'explore',
                                    item.client_id,
                                    tabContent[tabContentItemIndex + 1].id,
                                    validIdHelper(`embedContainer-${demoComponentType}-${tabContent[tabContentItemIndex + 1].id}`)
                                  );
                                  event.stopPropagation();
                                } else {
                                  // setPaywallModal();

                                  setPaywallModal({
                                    'show': true,
                                    'permissionNeeded': 'explore'
                                  });
                                }
                              }
                              }
                              color="default"
                            >
                              {lookerUser.user_attributes.permission_level === 'premium' ? 'Explore' : <div> <Icon className={`fa fa-lock ${classes.faSm} ${classes.mr12}`} />Explore</div>}
                            </Button>
                          </Grid>
                        </Grid>


                      </div>
                      : key === 'looks' ?
                        <div
                          id={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                          key={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                          className={`${classes.labelRoot} ${classes.parentHoverVisibility}`}>
                          <Grid container>
                            <Grid item sm={6} className={`${classes.overflowHidden}`}>
                              {/* {item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title} */}
                              {item.title}
                            </Grid>
                            <Grid item sm={6}>
                              <Button
                                id={`${validIdHelper(demoComponentType + '-innerTreeItem-EditButton' + treeCounter)}`}
                                key={`${validIdHelper(demoComponentType + '-innerTreeItem-EditButton' + treeCounter)}`}
                                size="small"
                                className={`${classes.ml12} ${classes.childHoverVisibility}`}
                                onClick={(event) => {
                                  if (lookerUser.user_attributes.permission_level === 'premium') {
                                    // setSelected(treeCounter);
                                    action(
                                      key.substring(0, key.length - 1),
                                      item.id,
                                      'edit',
                                      item.client_id,
                                      tabContent[tabContentItemIndex + 1].id,
                                      validIdHelper(`embedContainer-${demoComponentType}-${tabContent[tabContentItemIndex + 1].id}`)
                                    );
                                    event.stopPropagation();
                                  } else {
                                    // setPaywallModal();

                                    setPaywallModal({
                                      'show': true,
                                      'permissionNeeded': 'explore'
                                    });
                                  }
                                }
                                }
                                color="primary"
                              >
                                Edit
                                                                                            </Button>
                              <Button
                                id={`${validIdHelper(demoComponentType + '-innerTreeItem-DeleteButton' + treeCounter)}`}
                                key={`${validIdHelper(demoComponentType + '-innerTreeItem-DeleteButton' + treeCounter)}`}
                                size="small"
                                className={`${classes.ml12} ${classes.childHoverVisibility}`}
                                onClick={(event) => {
                                  if (lookerUser.user_attributes.permission_level === 'premium') {
                                    // setSelected(treeCounter);
                                    action(
                                      key.substring(0, key.length - 1),
                                      item.id,
                                      'delete',
                                      item.client_id,
                                      tabContent[tabContentItemIndex + 1].id,
                                      validIdHelper(`embedContainer-${demoComponentType}-${tabContent[tabContentItemIndex + 1].id}`)
                                    );
                                    event.stopPropagation();
                                  } else {
                                    // setPaywallModal();

                                    setPaywallModal({
                                      'show': true,
                                      'permissionNeeded': 'explore'
                                    });
                                  }
                                }
                                }
                                color="secondary"
                              >
                                Delete
                                                                                            </Button>
                            </Grid>
                          </Grid>

                        </div>
                        : <Grid container><Grid item sm={12}>{item.title}</Grid></Grid>
                    }
                    onClick={() => {
                      // setSelected(treeCounter)
                      action(
                        key.substring(0, key.length - 1), item.id)
                    }} />

                ))
                :
                ''
            }
          </TreeItem>

        </React.Fragment>
      )) : ''}
    </TreeView>
  )
}