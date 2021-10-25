import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { Grid, Button } from '@material-ui/core'
import { TreeView, TreeItem } from '@material-ui/lab';
import { ExpandMore, ChevronRight, Lock, Folder } from '@material-ui/icons';
import '../../Home.css';
import AppContext from '../../../contexts/AppContext';

const { validIdHelper } = require('../../../tools');

export const TreeSideBar = ({ staticContent, staticContent: { lookerContent }, classes, demoComponentType, tabContent, tabContentItemIndex, action, apiContent }) => {

  const { clientSession, setPaywallModal, } = useContext(AppContext)
  const { lookerUser } = clientSession
  const sharedFolderId = lookerContent[0].type === 'folder' ? lookerContent[0].id : '';
  let treeCounter = 0;
  const [selected, setSelected] = useState("2");
  const expandedArr = Object.keys(apiContent).length ? ["1", "" + (2 + apiContent[Object.keys(apiContent)[0]].length)] : [];
  const [expanded, setExpanded] = useState(expandedArr);

  useEffect(() => {
    setExpanded(expandedArr)
    setSelected(selected)
  }, [apiContent]);

  return (
    <TreeView
      className={classes.tree}
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
      expanded={expanded}
      // onNodeToggle={handleToggle}
      onNodeSelect={setSelected}
      selected={selected}
    >
      {apiContent ? Object.keys(apiContent).map((key, outerIndex) => (
        <React.Fragment
          key={`${validIdHelper(demoComponentType + '-innerFragment-' + outerIndex)}`}>
          <TreeItem
            key={`${validIdHelper(demoComponentType + '-outerTreeItem-' + outerIndex)}`}
            nodeId={"" + (treeCounter += 1)}
            label={_.capitalize(key)}
            icon={
              <Folder />
            }
            disabled={apiContent[key].length ? false : true}
          >
            {
              apiContent[key].length ?
                apiContent[key].map((item, index) => (
                  <TreeItem
                    key={`${validIdHelper(demoComponentType + '-innerTreeItem-' + treeCounter)}`}
                    nodeId={"" + (treeCounter += 1)}
                    treecounter={treeCounter}
                    aria-selected={false}
                    // selected={selected === treeCounter}
                    // className={selected === treeCounter ? `Mui-selected innerTreeItem ${classes.whiteSpaceNoWrap}` : `innerTreeItem ${classes.whiteSpaceNoWrap}`}
                    contentid={item.id}
                    label={item.folder_id === sharedFolderId &&
                      key === 'reports' ?
                      <div
                        id={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                        key={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                        className={`${classes.labelRoot} ${classes.parentHoverVisibility}`}
                      >
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
                                  setPaywallModal({
                                    'show': true,
                                    'permissionNeeded': 'explore'
                                  });
                                }
                              }
                              }
                              color="default"
                              startIcon={lookerUser.user_attributes.permission_level === 'premium' ? "" : <Lock />}
                            >
                              Explore
                            </Button>
                          </Grid>
                        </Grid>


                      </div>
                      : key === 'reports' ?
                        <div
                          id={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                          key={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                          className={`${classes.labelRoot} ${classes.parentHoverVisibility}`}>
                          <Grid container>
                            <Grid item sm={6} className={`${classes.overflowHidden}`}>
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
