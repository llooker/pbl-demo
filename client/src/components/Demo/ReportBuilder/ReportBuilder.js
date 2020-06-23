import $ from 'jquery';
import React, { useState, useEffect } from 'react';
import { AppBar, Tabs, Tab, Typography, Box, Grid, Icon, CircularProgress, Card, Button } from '@material-ui/core'
import { TreeView, TreeItem } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CodeFlyout from '../CodeFlyout'
import useStyles from './styles.js';
import { TabPanel, a11yProps } from './helpers.js';
import '../../Home.css';
const { validIdHelper } = require('../../../tools');


function TreeSideBar(props) {



  const { staticContent, staticContent: { lookerContent }, classes, demoComponentType, tabContent, tabContentItemIndex, action, apiContent, lookerUser } = props
  const sharedFolderId = lookerContent[0].type === 'folder' ? lookerContent[0].id : '';
  let treeCounter = 0;

  const [selected, setSelected] = useState(2)
  const [expanded, setExpanded] = useState(["1"]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  }

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

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
            treecounter={treeCounter}
            label={key.charAt(0).toUpperCase() + key.substring(1)}
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
                      key === 'looks' &&
                      lookerUser.permission_level === 'premium' ?

                      < div
                        id={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                        key={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                        className={`${classes.labelRoot} ${classes.parentHoverVisibility}`}>
                        {item.title}

                        <Button
                          id={`${validIdHelper(demoComponentType + '-innerTreeItem-Explore' + treeCounter)}`}
                          key={`${validIdHelper(demoComponentType + '-innerTreeItem-Explore' + treeCounter)}`}
                          size="small"
                          className={`${classes.ml24} ${classes.childHoverVisibility}`}
                          onClick={(event) => {
                            setSelected(treeCounter);
                            action(
                              key.substring(0, key.length - 1),
                              item.id,
                              'explore',
                              item.client_id,
                              tabContent[tabContentItemIndex + 1].id,
                              validIdHelper(`embedContainer-${demoComponentType}-${tabContent[tabContentItemIndex + 1].id}`)
                            );
                            event.stopPropagation();
                          }
                          }
                          color="default"
                        >
                          Explore
                                                                                            </Button>
                      </div>
                      : key === 'looks' && lookerUser.permission_level === 'premium' ?
                        <div
                          id={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                          key={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                          className={`${classes.labelRoot} ${classes.parentHoverVisibility}`}>
                          {item.title}
                          <Button
                            id={`${validIdHelper(demoComponentType + '-innerTreeItem-EditButton' + treeCounter)}`}
                            key={`${validIdHelper(demoComponentType + '-innerTreeItem-EditButton' + treeCounter)}`}
                            size="small"
                            className={`${classes.ml24} ${classes.childHoverVisibility}`} //
                            onClick={(event) => {
                              setSelected(treeCounter);
                              action(
                                key.substring(0, key.length - 1),
                                item.id,
                                'edit',
                                item.client_id,
                                tabContent[tabContentItemIndex + 1].id,
                                validIdHelper(`embedContainer-${demoComponentType}-${tabContent[tabContentItemIndex + 1].id}`)
                              );
                              event.stopPropagation();
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
                            className={`${classes.ml24} ${classes.childHoverVisibility}`} //
                            onClick={(event) => {
                              setSelected(treeCounter);
                              action(
                                key.substring(0, key.length - 1),
                                item.id,
                                'delete',
                                item.client_id,
                                tabContent[tabContentItemIndex + 1].id,
                                validIdHelper(`embedContainer-${demoComponentType}-${tabContent[tabContentItemIndex + 1].id}`)
                              );
                              event.stopPropagation();
                            }
                            }
                            color="secondary"
                          >
                            Delete
                                                                                            </Button>
                        </div>
                        : item.title
                    }
                    onClick={() => {
                      setSelected(treeCounter)
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

export default function ReportBuilder(props) {

  // console.log('ReportBuilder')
  // console.log('props', props)

  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { staticContent, staticContent: { lookerContent }, staticContent: { type }, LookerEmbedSDK, activeTabValue, handleTabChange, lookerUser, sampleCode } = props;
  const sampleCodeTab = { type: 'sample code', label: 'Code', id: 'sampleCode', lookerUser, sampleCode }
  const demoComponentType = type || 'sample code';
  // const tabContent = [...lookerContent, sampleCodeTab]
  const tabContent = lookerUser.permission_level === 'premium' ?
    [...lookerContent, sampleCodeTab] :
    [lookerContent[0], sampleCodeTab];

  const [iFrameExists, setIFrame] = useState(0);
  const [apiContent, setApiContent] = useState([]);
  const [exploreObj, setExploreObj] = useState({});

  const handleChange = (event, newValue) => {
    handleTabChange(newValue);
    setValue(newValue);

    if (newValue === 0) performLookerApiCalls(lookerContent)
  };

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
        performLookerApiCalls(lookerContent)
      }
    }
  }

  const performLookerApiCalls = function (lookerContent) {
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
        let looksToUse = [...lookerResponseData.sharedFolder.looks, ...lookerResponseData.embeddedUserFolder.looks]
        let dashboardsToUse = [...lookerResponseData.sharedFolder.dashboards]
        let objToUse = {
          looks: looksToUse,
          dashboards: dashboardsToUse
        }

        if (objToUse.looks.length) {
          objToUse.looks.map((item, index) => {
            let lookId = item.id
            LookerEmbedSDK.createLookWithId(lookId)
              .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`))
              .withClassName('iframe')
              .withClassName('look')
              .withClassName(lookerResponseData.sharedFolder.looks.indexOf(item) > -1 ? "shared" : "personal")
              .withClassName(index > 0 ? 'dNone' : 'oops')
              .withClassName(lookId)
              .build()
              .connect()
              .catch((error) => {
                // console.error('Connection error', error)
              })
          })
        }

        if (objToUse.dashboards.length) {
          objToUse.dashboards.map((item, index) => {
            let dashboardId = item.id
            LookerEmbedSDK.createDashboardWithId(dashboardId)
              .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`))
              .withClassName('iframe')
              .withClassName('dashboard')
              .withClassName(lookerResponseData.sharedFolder.dashboards.indexOf(item) > -1 ? "shared" : "personal")
              .withClassName('dNone')
              .withClassName(dashboardId)
              .build()
              .connect()
              .catch((error) => {
                console.error('Connection error', error)
              })
          })
        }
        setApiContent(objToUse)
      } else if (lookerContent.type === 'explore') {
        let exploreId = lookerContent.id;
        LookerEmbedSDK.createExploreWithId(exploreId)
          .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`))
          .withClassName('iframe')
          .on('explore:state:changed', (event) => {
          })
          .build()
          .connect()
          .then((explore) => {
            setIFrame(1)
            setExploreObj(exploreObj)
          })
          .catch((error) => {
            console.error('Connection error', error)
          })
      }
    })
  }

  useEffect(() => {
    if (activeTabValue > value) {
      setValue(activeTabValue)
    }

    performLookerApiCalls(lookerContent)

  }, [lookerContent]);


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

          {/* additional loading logic, need embedContainer to exist but want it hidden until iFrame has content...*/}
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
                    label={item.label}
                    className={item.type === 'sample code' ? `${classes.mlAuto}` : ``}
                    {...a11yProps(index)} />
                ))}
              </Tabs>
            </AppBar>

            <Box className="tabPanelContainer">
              {tabContent.map((tabContentItem, tabContentItemIndex) => (
                <TabPanel
                  key={`${validIdHelper(demoComponentType + '-tabPanel-' + tabContentItemIndex)}`}
                  value={value}
                  index={tabContentItemIndex}>
                  <Grid container>
                    {tabContentItem.type === 'sample code' ?
                      <Grid item sm={12} >
                        <Typography variant="h5" component="h2" className={classes.gridTitle}>
                          Sample Code<br />
                        </Typography>
                        <CodeFlyout code={tabContentItem.sampleCode} />
                        <Typography variant="h5" component="h2" className={classes.gridTitle}>
                          Looker User<br />
                        </Typography>
                        <CodeFlyout code={tabContentItem.lookerUser} />
                      </Grid>
                      :
                      tabContentItemIndex === 0
                        ?
                        <React.Fragment
                          key={`${validIdHelper(demoComponentType + '-outerFragment-' + tabContentItemIndex)}`}>
                          <Grid item sm={4} >
                            <TreeSideBar {...props}
                              classes={classes}
                              demoComponentType={demoComponentType}
                              tabContent={tabContent}
                              tabContentItemIndex={tabContentItemIndex}
                              action={action}
                              apiContent={apiContent} />
                          </Grid>
                          <Grid item sm={8} >
                            <div
                              className="embedContainer"
                              id={validIdHelper(`embedContainer-${demoComponentType}-${tabContentItem.id}`)}
                              key={validIdHelper(`embedContainer-${demoComponentType}-${tabContentItem.id}`)}
                            >
                            </div>
                          </Grid>
                        </React.Fragment>
                        :
                        <Grid item sm={12} >
                          <div
                            className="embedContainer"
                            id={validIdHelper(`embedContainer-${demoComponentType}-${tabContentItem.id}`)}
                            key={validIdHelper(`embedContainer-${demoComponentType}-${tabContentItem.id}`)}
                          >
                          </div>
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

