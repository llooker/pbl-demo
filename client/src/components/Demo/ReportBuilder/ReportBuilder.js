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
import { ApiHighlight, EmbedHighlight } from '../../Highlights/Highlight';
import AppContext from '../../../AppContext';
const { validIdHelper } = require('../../../tools');

//start of ReportBuilder Component
export default function ReportBuilder(props) {
  //initialize state using hooks
  const [iFrameExists, setIFrame] = useState(0);
  const [apiContent, setApiContent] = useState([]);
  const [exploreObj, setExploreObj] = useState({});
  const [clientSideCode, setClientSideCode] = useState('');
  const [serverSideCode, setServerSideCode] = useState('');

  const { togglePayWallModal, codeShow } = useContext(AppContext)

  //declare constants
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { staticContent, staticContent: { lookerContent }, staticContent: { type }, activeTabValue, handleTabChange, lookerUser, lookerHost } = props;

  const demoComponentType = type;
  const tabContent = [...lookerContent]

  //handle tab change
  const handleChange = (event, newValue) => {

    if (newValue == 1 && lookerUser.permission_level != 'premium') {
      // togglePayWallModal()

      togglePayWallModal({
        'show': true,
        'permissionNeeded': 'explore'
      });
    } else {
      handleTabChange(newValue);
      setValue(newValue);
      if (value > 0 && newValue === 0) performLookerApiCalls(lookerContent)
    }
  };

  /**
   * listen for lookerContent and call 
   * performLookerApiCalls and setSampleCode
  */
  useEffect(() => {
    if (activeTabValue > value) {
      setValue(activeTabValue)
    }
    setTimeout(() => performLookerApiCalls(lookerContent, 1), 100)
    setClientSideCode(rawSampleCode)
  }, [lookerContent, lookerUser]);

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
      $(`#${newReportEmbedContainer}`).empty();

      LookerEmbedSDK.createExploreWithId(exploreId)
        .appendTo(`#${newReportEmbedContainer}`)
        .withClassName('iframe')
        .on('explore:state:changed', (event) => {
        })
        .withClassName("exploreIframe")
        .withParams({
          qid: qid
        })
        .build()
        .connect()
        .then((explore) => {
          setIFrame(1)
          setExploreObj(explore)
          LookerEmbedSDK.init(`https://${lookerHost}.looker.com`);
        })
        .catch((error) => {
          console.error('Connection error', error)
        })
      handleChange('edit', 1)
    } else if (secondaryAction === 'delete') {
      let lookerResponse = await fetch('/deletelook/' + contentId, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (lookerResponse.status === 200) {
        performLookerApiCalls(lookerContent, 1)
      }
    }
  }

  const performLookerApiCalls = function (lookerContent, animateLoad) {
    if (animateLoad) {
      handleChange('refresh', 0)
      setIFrame(0)
      setApiContent([])
    }

    lookerContent.map(async lookerContent => {
      if (lookerContent.type === 'folder') {
        let lookerResponse = await fetch('/fetchfolder/' + lookerContent.id, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })

        let lookerResponseData = await lookerResponse.json();
        if (serverSideCode.length === 0) setServerSideCode(lookerResponseData.code);

        let looksToUse = [...lookerResponseData.sharedFolder.looks];
        if (lookerUser.permission_level === 'premium' &&
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
                  // setIFrame(1)
                  LookerEmbedSDK.init(`https://${lookerHost}.looker.com`);
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
                  LookerEmbedSDK.init(`https://${lookerHost}.looker.com`);
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
      } else if (lookerContent.type === 'explore' && lookerUser.permission_level === 'premium') {
        let exploreId = lookerContent.id;
        $(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`)).html('')
        LookerEmbedSDK.createExploreWithId(exploreId)
          .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`))
          .withClassName('iframe')
          .on('explore:state:changed', (event) => {
          })
          .build()
          .connect()
          .then((explore) => {
            setTimeout(() => setIFrame(1), 1000)
            setExploreObj(exploreObj)
            LookerEmbedSDK.init(`https://${lookerHost}.looker.com`);
          })
          .catch((error) => {
            console.error('Connection error', error)
          })
      }
    })
  }


  return (
    <div className={`${classes.root} ${classes.padding30} demoComponent`}>
      <Grid container
        spacing={3}
        key={validIdHelper(type)} >
        <div className={classes.root}>
          {iFrameExists ? '' :
            <Grid item sm={12} >
              <Card className={`${classes.card} ${classes.flexCentered}`} elevation={0}>
                <CircularProgress className={classes.circularProgress} />
              </Card>
            </Grid>
          }

          {/* additional loading logic, need embedContainer to exist but want it hidden until iFrame has content...*/}
          <Box className={iFrameExists ? `${classes.positionRelative}` : `${classes.hidden} ${classes.positionRelative}`}>
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

                        {lookerUser.permission_level != 'premium' ?
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
              {codeShow ? <Grid item sm={6}
                className={`${classes.positionTopRight}`}
              >
                <CodeFlyout {...props}
                  classes={classes}
                  lookerUser={lookerUser} />
              </Grid> : ''}
              {tabContent.map((tabContentItem, tabContentItemIndex) => (
                <TabPanel
                  key={`${validIdHelper(demoComponentType + '-tabPanel-' + tabContentItemIndex)}`}
                  value={value}
                  index={tabContentItemIndex}>
                  <Grid container>
                    {
                      tabContentItemIndex === 0
                        ?
                        <React.Fragment
                          key={`${validIdHelper(demoComponentType + '-outerFragment-' + tabContentItemIndex)}`}>
                          <Grid item sm={4} >
                            <ApiHighlight height={500} classes={classes}>
                              <TreeSideBar {...{
                                togglePayWallModal,
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
              ))}
            </Box>
          </Box >
        </div>
      </Grid >
    </div >
  )
}


function TreeSideBar(props) {
  // console.log('TreeSideBar')
  const { staticContent, staticContent: { lookerContent }, classes, demoComponentType, tabContent, tabContentItemIndex, action, apiContent, lookerUser, togglePayWallModal } = props
  const sharedFolderId = lookerContent[0].type === 'folder' ? lookerContent[0].id : '';
  let treeCounter = 0;
  const [selected, setSelected] = useState(2)
  const expandedArr = Object.keys(apiContent).length ? ["1", "" + (2 + apiContent[Object.keys(apiContent)[0]].length)] : [];
  const [expanded, setExpanded] = useState(expandedArr);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  }

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };


  useEffect(() => {
    setExpanded(expandedArr)
  }, [apiContent]);

  return (
    <TreeView
      className={classes.tree}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      onNodeToggle={handleToggle}
      onNodeSelect={handleSelect}
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
                    className={selected === treeCounter ? `Mui-selected innerTreeItem` : `innerTreeItem`}
                    contentid={item.id}
                    label={item.folder_id === sharedFolderId &&
                      key === 'looks' ?

                      < div
                        id={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                        key={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                        className={`${classes.labelRoot} ${classes.parentHoverVisibility}`}>
                        {item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title}

                        <Button
                          id={`${validIdHelper(demoComponentType + '-innerTreeItem-Explore' + treeCounter)}`}
                          key={`${validIdHelper(demoComponentType + '-innerTreeItem-Explore' + treeCounter)}`}
                          size="small"
                          className={`${classes.ml12} ${classes.childHoverVisibility}`}
                          onClick={(event) => {
                            if (lookerUser.permission_level === 'premium') {
                              // setSelected(treeCounter);
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
                              // togglePayWallModal();

                              togglePayWallModal({
                                'show': true,
                                'permissionNeeded': 'explore'
                              });
                            }
                          }
                          }
                          color="default"
                          icon="hidden"
                        >
                          {lookerUser.permission_level === 'premium' ? 'Explore' : <div> <Icon className={`fa fa-lock ${classes.faSm} ${classes.mr12}`} />Explore</div>}
                        </Button>
                      </div>
                      : key === 'looks' ?
                        <div
                          id={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                          key={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                          className={`${classes.labelRoot} ${classes.parentHoverVisibility}`}>

                          {item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title}                          <Button
                            id={`${validIdHelper(demoComponentType + '-innerTreeItem-EditButton' + treeCounter)}`}
                            key={`${validIdHelper(demoComponentType + '-innerTreeItem-EditButton' + treeCounter)}`}
                            size="small"
                            className={`${classes.ml12} ${classes.childHoverVisibility}`}
                            onClick={(event) => {
                              if (lookerUser.permission_level === 'premium') {
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
                                // togglePayWallModal();

                                togglePayWallModal({
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
                              if (lookerUser.permission_level === 'premium') {
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
                                // togglePayWallModal();

                                togglePayWallModal({
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
                        </div>
                        : item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title
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