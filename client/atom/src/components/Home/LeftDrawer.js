import _ from 'lodash'
import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import AppContext from '../../contexts/AppContext';
import { Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Icon } from '@material-ui/core/';
import { ChevronLeft } from '@material-ui/icons';

import { useStyles } from './styles.js';
import BottomBar from './BottomBar'; //needs refactor

const { validIdHelper } = require('../../tools');

export default function LeftDrawer({ DemoComponentsContentArr }) {
  // console.log('LeftDrawer');

  const classes = useStyles();
  const { drawerOpen, setDrawerOpen, } = useContext(AppContext);

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={drawerOpen}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton
          onClick={() => setDrawerOpen(false)}>
          <ChevronLeft
            aria-label="close drawer"
          />
        </IconButton>
      </div>

      <MenuList
        classes={classes}
        DemoComponentsContentArr={DemoComponentsContentArr} />

      {/* should be refactored */}
      <BottomBar classes={classes} />
    </Drawer>
  )
}

function MenuList({ classes, DemoComponentsContentArr }) {
  // console.log("MenuList")
  const { clientSession, selectedMenuItem } = useContext(AppContext);
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

  console.log({ orderedDemoComponentsForMenuObj })

  return (<List
    component="nav"
    aria-labelledby="nested-list-subheader"
    className={classes.list}
  >
    {packageName ? Object.keys(orderedDemoComponentsForMenuObj).map((outerItem, outerIndex) => {
      return (
        < React.Fragment
          key={`${validIdHelper(outerItem + '-menuList-' + outerIndex)}`}>
          <ListItem
            key={`${validIdHelper(outerItem + '-outerListItem-' + outerIndex)}`}
          >
            <ListItemText primary={outerItem === 'home' ? '' : _.capitalize(outerItem)} />
          </ListItem>
          < List component="div" disablePadding
            key={`${validIdHelper(outerItem + '-innerList-' + outerIndex)}`}>
            {orderedDemoComponentsForMenuObj[outerItem].map((item, innerIndex) => {
              const MatchingIconComponent = item.icon
              return (
                <ListItem
                  button
                  className={`${classes.nested} ${classes.roundedTab}`}
                  key={`${validIdHelper(outerItem + '-innerListItem-' + innerIndex)}`}
                  selected={validIdHelper(_.lowerCase(item.label)) === selectedMenuItem}
                  component={Link}
                  to={validIdHelper(_.lowerCase(item.label))}
                >
                  <ListItemIcon>
                    {MatchingIconComponent ? <MatchingIconComponent /> : <></>}
                  </ListItemIcon>
                  <ListItemText primary={_.capitalize(item.label)} />
                </ListItem>
              )
            })}
          </List>
        </React.Fragment>
      )
    }) : ''
    }
  </List >
  )
}
