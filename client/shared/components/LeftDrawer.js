import _ from 'lodash'
import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core/';
import { ChevronLeft } from '@material-ui/icons';
import {VectorThumbnail} from "./VectorThumbnail"
const { validIdHelper, appContextMap } = require('../utils/tools');

export const LeftDrawer = ({ DemoComponentsContentArr, classes }) => {
  const { drawerOpen, setDrawerOpen, } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);

  return (
    <Drawer
      className={classes.leftDrawer}
      variant="persistent"
      anchor="left"
      open={drawerOpen}
      classes={{
        paper: classes.leftDrawerPaper,
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

    </Drawer>
  )
}

function MenuList({ classes, DemoComponentsContentArr }) {
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
    className={classes.list}
  >
    {packageName ? Object.keys(orderedDemoComponentsForMenuObj).map((outerItem, outerIndex) => {
      return (
        <React.Fragment
          key={`${validIdHelper(outerItem + '-menuList-' + outerIndex)}`}>
          <ListItem
            key={`${validIdHelper(outerItem + '-outerListItem-' + outerIndex)}`}
            className={classes.menuHeaderListItem}
          >
            {
              outerItem !== 'home'
                ? [
                  <span className={classes.menuHeaderListItemText}>
                    {_.capitalize(outerItem)}
                  </span>,
                  <div className={classes.menuHeaderListItemFiller} />,
                ]
                : <></>
            }
          </ListItem>
          < List component="div" disablePadding
            key={`${validIdHelper(outerItem + '-innerList-' + outerIndex)}`}>
            {orderedDemoComponentsForMenuObj[outerItem].map((item, innerIndex) => {
              const MatchingIconComponent = item.icon
              
              const to = validIdHelper(_.lowerCase(item.label))
              const selected = to === selectedMenuItem

              return (
                <>
                <ListItem
                  button
                  className={`${classes.menuListItem}`}
                  key={`${validIdHelper(outerItem + '-innerListItem-' + innerIndex)}`}
                  selected={selected}
                  component={Link}
                  to={to}
                >
                  <ListItemIcon className={classes.menuListItemIcon} color="red">
                    {MatchingIconComponent ? <MatchingIconComponent /> : <></>}
                  </ListItemIcon>
                  <ListItemText primary={_.capitalize(item.label)} />
                </ListItem>
                {item.thumbnail && <VectorThumbnail classes={classes} {...item.thumbnail}/>}
                </>
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
