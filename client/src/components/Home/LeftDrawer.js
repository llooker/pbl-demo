import _ from 'lodash'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useHistory, } from "react-router-dom";
import AppContext from '../../contexts/AppContext';
import { endSession } from '../../AuthUtils/auth';
import UsecaseContent from '../../usecaseContent.json';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { ThemeProvider } from '@material-ui/core/styles';
import {
  Drawer,
  IconButton,
  ListSubheader, List, ListItem, ListItemIcon, ListItemText,
  Badge, FormControlLabel, Switch, Button
} from '@material-ui/core/';
import { AddAlert, ShowChart, VisibilityOutlined, DateRangeOutlined, Search, FindInPage, Code, TableChartOutlined, LibraryBooksOutlined, Menu, ChevronLeft } from '@material-ui/icons';
import HomeIcon from '@material-ui/icons/Home';
import { useStyles, } from './styles.js';

const { validIdHelper } = require('../../tools');


export default function LeftDrawer(props) {
  console.log('LeftDrawer');

  const classes = useStyles();
  const { drawerOpen, setDrawerOpen, activeUsecase } = useContext(AppContext)

  console.log({ activeUsecase })
  console.log({ drawerOpen })
  console.log({ setDrawerOpen })


  let orderedDemoComponentsForMenu = activeUsecase ? _.orderBy(UsecaseContent[activeUsecase].demoComponents, ['menuCategory'], ['asc']) : [];
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
  })

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
          <ChevronLeft />
        </IconButton>
      </div>

      {/* LeftDrawer */}

      {Object.keys(orderedDemoComponentsForMenuObj).length ?
        <MenuList
          // {...this.props}
          classes={classes}
          // activeUsecase={activeUsecase}
          orderedDemoComponentsForMenuObj={orderedDemoComponentsForMenuObj}
        // selectedMenuItem={selectedMenuItem}
        // handleMenuItemSelect={handleMenuItemSelect}
        /> : ''}

    </Drawer>
  )
}

function MenuList(props) {

  console.log("MenuList")
  console.log({ props })

  const { classes, orderedDemoComponentsForMenuObj } = props

  const { drawerOpen, setDrawerOpen, activeUsecase, selectedMenuItem, handleMenuItemSelect } = useContext(AppContext)


  const demoComponentIconMap = {
    "splashpage19": HomeIcon,
    "customfilter5": VisibilityOutlined,
    "simpledashboard9": ShowChart,
    "customfilter1": TableChartOutlined,
    "customvis": DateRangeOutlined,
    "querybuilderexplorelite": Search,
    "reportbuilder14": LibraryBooksOutlined,
  }

  return (<List
    component="nav"
    aria-labelledby="nested-list-subheader"
    className={classes.list}
  >
    {activeUsecase ? Object.keys(orderedDemoComponentsForMenuObj).map((outerItem, outerIndex) => {
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
              const key = item.lookerContent[0].id ? validIdHelper(item.type + item.lookerContent[0].id) : validIdHelper(item.type);
              const MatchingIconComponent = demoComponentIconMap[key]

              return (
                <ListItem
                  button
                  className={`${classes.nested} ${classes.roundedTab}`}
                  key={`${validIdHelper(outerItem + '-innerListItem-' + innerIndex)}`}
                  onClick={
                    () => handleMenuItemSelect(validIdHelper(item.lookerContent[0].id ? item.type + item.lookerContent[0].id : item.type))
                  }
                  selected={validIdHelper(item.lookerContent[0].id ? item.type + item.lookerContent[0].id : item.type) === selectedMenuItem}
                >
                  <ListItemIcon>
                    <MatchingIconComponent />
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
