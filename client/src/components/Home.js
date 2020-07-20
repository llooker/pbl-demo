import _ from 'lodash'
import React, { Component } from 'react'
import clsx from 'clsx';
import { withStyles } from "@material-ui/core/styles";
import {
  Drawer, CssBaseline, AppBar, Toolbar, Typography,
  Divider, IconButton, Tabs, Tab, Icon, Box, Avatar,
  ListSubheader, List, ListItem, ListItemIcon, ListItemText,
  Badge
} from '@material-ui/core/';

import { AddAlert, Speed, TrendingUp, StoreMallDirectory, DateRange, Search, FindInPage } from '@material-ui/icons';
import HomeIcon from '@material-ui/icons/Home'; //can't reuse home name
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { blue, grey } from '@material-ui/core/colors';
import UserMenu from './Material/UserMenu';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import UsecaseContent from '../usecaseContent.json';
import SplashPage from './Demo/SplashPage/SplashPage';
import Dashboard from './Demo/Dashboard/Dashboard';
import CustomVis from './Demo/CustomVis/CustomVis';
import ReportBuilder from './Demo/ReportBuilder/ReportBuilder';
import QueryBuilder from './Demo/QueryBuilder/QueryBuilder';
import AppContext from '../AppContext';
import { HighlightSourcesLegend } from './HighlightSourcesLegend';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/agate';
import './Home.css'; //needed for iframe height
import { MonetizationModal } from './Demo/MonetizationModal';



const drawerWidth = 240;
const { validIdHelper } = require('../tools');

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    zIndex: 1201
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  title: {
    flexGrow: 1,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  dNone: {
    display: 'none'
  },
  dBlock: {
    display: 'block'
  },
  relative: {
    position: 'relative'
  },
  absolute: {
    position: 'absolute'
  },
  right0: {
    right: 0
  },
  top0: {
    top: 0
  },
  right24: {
    right: 24
  },
  top24: {
    top: 24
  },
  ml12: {
    marginLeft: 12
  },
  mr12: {
    marginRight: 12
  },
  mt12: {
    marginTop: 12
  },
  highlightLegend: {
    position: 'fixed',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    zIndex: 1200
  },
  tree: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400
  },
  parentHoverVisibility: {
    '&:hover $childHoverVisibility': {
      visibility: 'visible'
    }

  },
  childHoverVisibility: {
    visibility: 'hidden'
  },
  fontSize1em: {
    fontSize: '1em'
  },
  padding10: {
    padding: 10
  },
  mt5: {
    marginTop: 5
  },
  mb5: {
    marginBottom: 5
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
});

const defaultTheme = createMuiTheme({})
const atomTheme = createMuiTheme({
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: grey[400],
    },
  },
})

const vidlyTheme = createMuiTheme({
  palette: {
    primary: {
      main: blue[500],
    },
  },
})

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: true,
      drawerTabValue: 0,
      activeTabValue: 0,
      activeUsecase: '',
      appLayout: '',
      highlightShow: false,
      showPayWallModal: false,
      selectedMenuItem: ''
    }
  }

  toggleShowPayWallModal = () => {
    this.setState({ showPayWallModal: !this.state.showPayWallModal })
  }

  toggleHighlightShow = () => {
    this.setState({ highlightShow: !this.state.highlightShow })
  }

  handleTabChange = newValue => {
    this.setState({
      activeTabValue: newValue
    })
  }

  handleMenuItemSelect = (newValue, fromSplash) => {
    let selectedMenuItemValue = ''
    if (fromSplash) {
      UsecaseContent[this.state.activeUsecase].demoComponents.map(item => {
        if (item.type !== "splash page") {
          item.lookerContent.map(lookerContentItem => {
            if (lookerContentItem.id === newValue) {
              selectedMenuItemValue = validIdHelper(item.type + lookerContentItem.id)
            }
          })
        }
      })
    } else selectedMenuItemValue = newValue;
    this.setState({
      selectedMenuItem: selectedMenuItemValue
    })
  };

  componentDidMount(props) {
    let usecaseFromUrl = window.location.pathname.replace(/^\/([^\/]*).*$/, '$1');
    this.setState({
      activeUsecase: usecaseFromUrl,
      appLayout: UsecaseContent[usecaseFromUrl].layout || 'left-sidebar'
    }, () => {
      LookerEmbedSDK.init(`${this.props.lookerHost}.looker.com`, '/auth');
    })
  }

  render() {

    //how to make this dynamic????
    const demoComponentMap = {
      "splashpage19": SplashPage,
      "simpledashboard5": Dashboard,
      "simpledashboard9": Dashboard,
      "customfilter1": Dashboard,
      "customvis": CustomVis,
      "querybuilderexplorelite": QueryBuilder,
      "reportbuilder14": ReportBuilder,
    };

    const themeMap = {
      "atom": atomTheme,
      "vidly": vidlyTheme
    }

    const { drawerTabValue, drawerOpen, activeTabValue, activeUsecase, selectedMenuItem } = this.state;
    const { handleTabChange, handleMenuItemSelect } = this;
    const { classes, activeCustomization, switchLookerUser, lookerUser, applySession, lookerUserAttributeBrandOptions, switchUserAttributeBrand, lookerHost, userProfile } = this.props

    let orderedDemoComponentsForMenu = activeUsecase ? _.orderBy(UsecaseContent[activeUsecase].demoComponents, ['menuCategory'], ['asc']) : []; // Use Lodash to sort array by 'name'
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

    if (activeUsecase && !selectedMenuItem.length) {
      this.setState({
        selectedMenuItem:
          UsecaseContent[activeUsecase].demoComponents[0].lookerContent[0].id ?
            validIdHelper(UsecaseContent[activeUsecase].demoComponents[0].type + UsecaseContent[activeUsecase].demoComponents[0].lookerContent[0].id) :
            validIdHelper(UsecaseContent[activeUsecase].demoComponents[0].type)
      }, () => {
      })

      //couldn't figure this out...
      // UsecaseContent[activeUsecase].demoComponents.map(item => {
      //   demoComponentMap[item.lookerContent[0].id ?
      //     validIdHelper(item.type + item.lookerContent[0].id) :
      //     validIdHelper(item.type)] = item.type.split(" ").map(item => _.capitalize(item)).join("")
      // })
    }

    return (
      <div className={classes.root}>
        <AppContext.Provider value={
          {
            show: this.state.highlightShow,
            toggleShow: this.toggleHighlightShow,
            showPayWallModal: this.state.showPayWallModal,
            toggleShowPayWallModal: this.toggleShowPayWallModal,
            lookerUser,
            userProfile
          }
        } >
          <ThemeProvider theme={activeUsecase ? themeMap[activeUsecase] : defaultTheme}>
            <CssBaseline />
            <AppBar
              position="fixed"
              className={clsx(classes.appBar)}
            >
              <Toolbar>

                {activeUsecase ?
                  <Avatar alt="Icon"
                    src={require(`../images/${activeUsecase}_logo.png`)}
                  // src={require(`../images/${activeUsecase}_logo_white.svg`)}
                  /> : ''}

                <Typography variant="h6" noWrap className={`${classes.title} ${classes.ml12}`}>
                  {activeUsecase ? UsecaseContent[activeUsecase].vignette.name : ''}
                </Typography>

                {/* Math.floor(Math.random() * 5) + 1 */}
                <Badge badgeContent={3} color="error" className={classes.mr12}>
                  <AddAlert />
                </Badge>
                <UserMenu
                  lookerUser={lookerUser}
                  switchLookerUser={switchLookerUser}
                  onLogoutSuccess={applySession}
                  lookerUserAttributeBrandOptions={lookerUserAttributeBrandOptions}
                  switchUserAttributeBrand={switchUserAttributeBrand}
                />
              </Toolbar>
            </AppBar>
            <Drawer
              className={classes.drawer}
              variant="persistent"
              anchor="left"
              open={drawerOpen}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div className={classes.drawerHeader} />

              {Object.keys(orderedDemoComponentsForMenuObj).length ?
                <MenuList {...this.props}
                  classes={classes}
                  activeUsecase={activeUsecase}
                  orderedDemoComponentsForMenuObj={orderedDemoComponentsForMenuObj}
                  selectedMenuItem={selectedMenuItem}
                  handleMenuItemSelect={handleMenuItemSelect} /> : ''}

              <HighlightSourcesLegend className={classes.highlightLegend} />
              <MonetizationModal {...{ classes }} />
            </Drawer>
            <main
              className={clsx(classes.content, {
                [classes.contentShift]: drawerOpen,
              })}
            >
              <div className={classes.drawerHeader} />
              {activeUsecase ?
                UsecaseContent[activeUsecase].demoComponents.map((item, index) => {
                  const key = item.lookerContent[0].id ? validIdHelper(item.type + item.lookerContent[0].id) : validIdHelper(item.type);
                  const DemoComponent = demoComponentMap[key];
                  return (
                    <Box key={validIdHelper(`box-${item.type}-${index}`)}
                    // className={key === selectedMenuItem ? `` : `${classes.hide}`}
                    >
                      {DemoComponent && key === selectedMenuItem ?
                        <DemoComponent key={validIdHelper(`treeItem-${item.type}-${index}`)}
                          staticContent={item}
                          handleMenuItemSelect={handleMenuItemSelect}
                          activeTabValue={activeTabValue}
                          handleTabChange={handleTabChange}
                          lookerUser={lookerUser}
                          activeUsecase={activeUsecase}
                          LookerEmbedSDK={LookerEmbedSDK}
                          lookerHost={lookerHost}
                          userProfile={userProfile}
                        /> : ''}
                    </Box>)
                }) :
                ''
              }
            </main >
          </ThemeProvider>
        </AppContext.Provider>
      </div >
    )
  }
}
export default withStyles(styles)(Home);

function MenuList(props) {
  const { classes, activeUsecase, orderedDemoComponentsForMenuObj, selectedMenuItem, handleMenuItemSelect } = props
  const demoComponentIconMap = {
    "splashpage19": HomeIcon,
    "simpledashboard5": TrendingUp,
    "simpledashboard9": Speed,
    "customfilter1": StoreMallDirectory,
    "customvis": DateRange,
    "querybuilderexplorelite": Search,
    "reportbuilder14": FindInPage,
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
          <ListItem button
            key={`${validIdHelper(outerItem + '-outerListItem-' + outerIndex)}`}
          >
            <ListItemText primary={_.capitalize(outerItem)} />
          </ListItem>
          < List component="div" disablePadding
            key={`${validIdHelper(outerItem + '-innerList-' + outerIndex)}`}>
            {orderedDemoComponentsForMenuObj[outerItem].map((item, innerIndex) => {
              const key = item.lookerContent[0].id ? validIdHelper(item.type + item.lookerContent[0].id) : validIdHelper(item.type);
              const MatchingIconComponent = demoComponentIconMap[key]

              return (
                <ListItem button className={classes.nested}
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