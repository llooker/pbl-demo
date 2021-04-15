import _ from 'lodash'
import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, AppBar, Button } from '@material-ui/core/';
const { validIdHelper, appContextMap } = require('../utils/tools');


export const TopDrawer = ({ DemoComponentsContentArr, classes }) => {
  // console.log('TopDrawer');
  // console.log({ DemoComponentsContentArr });

  const { drawerOpen, setDrawerOpen, } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);

  return (
    <Drawer
      className={classes.topDrawer}
      variant="persistent"
      anchor="top"
      open={drawerOpen}
      classes={{
        paper: classes.topDrawerPaper,
      }}
    >


      <div className={classes.drawerHeader} />

      <MenuList
        classes={classes}
        DemoComponentsContentArr={DemoComponentsContentArr} />

    </Drawer>
  )
}

function MenuList({ classes, DemoComponentsContentArr }) {
  // console.log("MenuList")
  const { clientSession, selectedMenuItem } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const { packageName } = clientSession;

  let orderedDemoComponentsForMenu = packageName ? _.orderBy(DemoComponentsContentArr, ['menuCategory'], ['asc']) : [];
  let orderedDemoComponentsForMenuObj = {};
  let expandedTreeItemsArr = [];
  let cumulativePusher = 0;
  orderedDemoComponentsForMenu.map((item, index) => {
    if (orderedDemoComponentsForMenuObj.hasOwnProperty(item.menuCategory)) {
      orderedDemoComponentsForMenuObj[item.menuCategory] = [...orderedDemoComponentsForMenuObj[item.menuCategory], item]
    } else {
      orderedDemoComponentsForMenuObj[item.menuCategory] = [item];
      cumulativePusher += 1;
      expandedTreeItemsArr.push("" + (index + cumulativePusher));
    }
  });

  return (<List
    component="nav"
    aria-labelledby="nested-list-subheader"
  // className={classes.flexRow}

  >
    {packageName ? Object.keys(orderedDemoComponentsForMenuObj).map((outerItem, outerIndex) => {
      return (
        < List component="div" disablePadding
          key={`${validIdHelper(outerItem + '-innerList-' + outerIndex)}`}
          className={classes.flexRow}
        >
          {
            orderedDemoComponentsForMenuObj[outerItem].map((item, innerIndex) => {
              const MatchingIconComponent = item.icon
              return (
                // <ListItem
                //   key={`${validIdHelper(outerItem + '-innerListItem-' + innerIndex)} `}
                //   button
                //   className={`${classes.nested} ${classes.roundedTab} ${classes.paddingTB2}`}
                //   selected={validIdHelper(_.lowerCase(item.label)) === selectedMenuItem}
                //   component={Link}
                //   to={validIdHelper(_.lowerCase(item.label))}
                //   alignItems="center"
                // >
                //   <ListItemIcon>
                //     {MatchingIconComponent ? <MatchingIconComponent /> : <></>}
                //   </ListItemIcon>
                //   <ListItemText className={`${classes.noWrap} `} primary={_.capitalize(item.label)} />
                // </ListItem>


                <Button
                  className={`${classes.ml12} ${classes.borderRadius100} ${classes.noBorder}`}
                  component={Link}
                  variant={validIdHelper(_.lowerCase(item.label)) === selectedMenuItem ? "contained" : "outlined"}
                  startIcon={MatchingIconComponent ? <MatchingIconComponent /> : <></>}
                  to={validIdHelper(_.lowerCase(item.label))}

                >
                  {_.startCase(item.label)}
                </Button>
              )
            })
          }
        </List>
      )
    }) : ''
    }
  </List >
  )
}
