import _ from 'lodash'
import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import AppContext from '../../contexts/AppContext';
import UsecaseContent from '../../usecaseContent.json';
import { Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core/';
import { AddAlert, ShowChart, VisibilityOutlined, DateRangeOutlined, Search, FindInPage, Code, TableChartOutlined, LibraryBooksOutlined, Menu, ChevronLeft } from '@material-ui/icons';
import HomeIcon from '@material-ui/icons/Home'; //already declared
import { useStyles } from './styles.js';
import BottomBar from './BottomBar'; //needs refactor

const { validIdHelper } = require('../../tools');

export default function LeftDrawer(props) {
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

      <MenuList classes={classes} />

      {/* should be refactored */}
      <BottomBar classes={classes} />
    </Drawer>
  )
}

function MenuList(props) {
  // console.log("MenuList")
  // console.log({ props })
  const { classes } = props
  const { activeUsecase, selectedMenuItem } = useContext(AppContext);

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


  const demoComponentIconMap = {
    "splashpage19": HomeIcon,
    "customfilter5": VisibilityOutlined,
    "simpledashboard9": ShowChart,
    "customfilter1": TableChartOutlined,
    "customvis": DateRangeOutlined,
    "querybuilderexplorelite": Search,
    "reportbuilder14": LibraryBooksOutlined,
  }


  // const demoComponentIconMap = {
  //   "home": HomeIcon,
  //   "inventoryoverview": VisibilityOutlined,
  //   "webanalytics": ShowChart,
  //   "salesoverview": TableChartOutlined,
  //   "salescalendar": DateRangeOutlined,
  //   "querybuilder": Search,
  //   "savedreports": LibraryBooksOutlined
  // };

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
                  selected={validIdHelper(_.lowerCase(item.label)) === selectedMenuItem}
                  component={Link}
                  to={validIdHelper(_.lowerCase(item.label))}
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
