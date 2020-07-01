import _ from 'lodash'
import React, { Component } from 'react'
import clsx from 'clsx';
import { withStyles } from "@material-ui/core/styles";
import {
  Drawer, CssBaseline, AppBar, Toolbar, Typography,
  Divider, IconButton, Tabs, Tab, Icon, Box, Avatar
} from '@material-ui/core/';
import { TreeView, TreeItem } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
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
import ComingSoon from './Demo/ComingSoon';
import AppContext from '../AppContext';
import { HighlightSourcesLegend } from './HighlightSourcesLegend';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/agate';
import './Home.css'; //needed for iframe height

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
  }
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
      selectedTreeItem: ''
    }
  }

  toggleHighlightShow = () => {
    this.setState({ highlightShow: !this.state.highlightShow })
  }

  handleDrawerTabChange = (event, newValue) => {
    this.handleDrawerChange(true);
    this.setState({
      drawerTabValue: newValue
    }, () => {
      this.handleTabChange(0)
    })
  };

  handleTabChange = newValue => {
    this.setState({
      activeTabValue: newValue
    })
  }

  // handleDrawerChange = (open) => {
  //   this.setState({
  //     drawerOpen: open
  //   })
  // }

  handleDrawerTreeItemChange = (event, newValue) => {
    let selectedTreeItemValue = ''
    UsecaseContent[this.state.activeUsecase].demoComponents.map(item => {
      if (item.type !== "splash page") {
        item.lookerContent.map(lookerContentItem => {
          if (lookerContentItem.id === newValue) {
            selectedTreeItemValue = validIdHelper(item.type + lookerContentItem.id)
          }
        })
      }
    })
    this.setState({
      selectedTreeItem: selectedTreeItemValue
    })
  }

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

    const { drawerTabValue, drawerOpen, activeTabValue, activeUsecase, selectedTreeItem } = this.state; //, sampleCode
    const {
      // handleDrawerChange, handleDrawerTabChange, 
      handleTabChange, handleDrawerTreeItemChange } = this;
    const { classes, activeCustomization, switchLookerUser, lookerUser, applySession, lookerUserAttributeBrandOptions, switchUserAttributeBrand, lookerHost } = this.props

    let treeCounter = 0;
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

    if (activeUsecase && !selectedTreeItem.length) {
      this.setState({
        selectedTreeItem:
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
        <AppContext.Provider value={{ show: this.state.highlightShow, toggleShow: this.toggleHighlightShow }} >
          <ThemeProvider theme={activeUsecase ? themeMap[activeUsecase] : defaultTheme}>
            <CssBaseline />
            <AppBar
              position="fixed"
              className={clsx(classes.appBar, {
                // [classes.appBarShift]: drawerOpen,
              })}
            >
              <Toolbar>
                {/* <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={() => handleDrawerChange(true)}
                  edge="start"
                  className={clsx(classes.menuButton, drawerOpen && classes.hide)}
                >
                  <MenuIcon />
                </IconButton> */}

                {activeUsecase ?
                  <Avatar alt="Icon"
                    src={require(`../images/${activeUsecase}_logo.png`)}
                  /> : ''}

                <Typography variant="h6" noWrap className={`${classes.title} ${classes.ml12}`}>
                  {activeUsecase ? UsecaseContent[activeUsecase].vignette.name : ''}
                </Typography>
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
              {/* <div className={classes.drawerHeader}>
                <IconButton onClick={() => handleDrawerChange(false)}>
                  <ChevronLeftIcon />
                </IconButton>
              </div>
              <Divider /> */}

              <div className={classes.drawerHeader} />

              <TreeView
                className={`${classes.tree} ${classes.mt12} ${classes.padding10}`}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                expanded={expandedTreeItemsArr}
              >
                {activeUsecase ? Object.keys(orderedDemoComponentsForMenuObj).map((key, outerIndex) => (
                  <TreeItem
                    key={`${validIdHelper(key + '-outerTreeItem-' + outerIndex)}`}
                    nodeId={"" + (treeCounter += 1)}
                    treecounter={treeCounter}
                    label={_.capitalize(key)}>
                    {orderedDemoComponentsForMenuObj[key].map((item, innerIndex) => (
                      <TreeItem
                        key={`${validIdHelper(key + '-innerTreeItem-' + treeCounter)}`}
                        nodeId={"" + (treeCounter += 1)}
                        treecounter={treeCounter}
                        // label={_.capitalize(item.label)}
                        // icon={<Icon className={`fa ${item.icon} ${classes.icon} ${classes.fontSize1em} ml12`} />}
                        label={< div
                          id={`${validIdHelper(key + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                          key={`${validIdHelper(key + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                          className={`${classes.labelRoot} ${classes.parentHoverVisibility}`}>
                          <Icon className={`fa ${item.icon} ${classes.icon} ${classes.fontSize1em}  ${classes.mr12} ${classes.mt12}`} />{_.capitalize(item.label)}
                        </div>}
                        selected={validIdHelper(item.lookerContent[0].id ? item.type + item.lookerContent[0].id : item.type) === selectedTreeItem}
                        className={validIdHelper(item.lookerContent[0].id ? item.type + item.lookerContent[0].id : item.type) === selectedTreeItem ? `Mui-selected innerTreeItem` : `innerTreeItem`}
                        onClick={(event) => {
                          this.setState({
                            selectedTreeItem:
                              item.lookerContent[0].id ? validIdHelper(item.type + item.lookerContent[0].id) : validIdHelper(item.type)
                          })
                        }}
                      // disabled={apiContent[key].length ? false : true}
                      />
                    ))}
                  </TreeItem>)) : ''}
              </TreeView>
              <HighlightSourcesLegend className={classes.highlightLegend} />
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
                      className={key === selectedTreeItem ? `` : `${classes.hide}`}>
                      <DemoComponent key={validIdHelper(`treeItem-${item.type}-${index}`)}
                        staticContent={item}
                        // handleDrawerTabChange={handleDrawerTabChange}
                        handleDrawerTreeItemChange={handleDrawerTreeItemChange}
                        activeTabValue={activeTabValue}
                        handleTabChange={handleTabChange}
                        lookerUser={lookerUser}
                        activeUsecase={activeUsecase}
                        LookerEmbedSDK={LookerEmbedSDK}
                        lookerHost={lookerHost}
                      // UsecaseContent={activeUsecase ? UsecaseContent[activeUsecase] : ''}
                      />
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