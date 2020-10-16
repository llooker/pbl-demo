import _ from 'lodash'
// import $ from 'jquery';
import React, { Component } from 'react'
import clsx from 'clsx';
import { withStyles } from "@material-ui/core/styles";
import {
  Drawer, CssBaseline, AppBar, Toolbar, Typography,
  Divider, IconButton, Tabs, Tab, Icon, Box, Avatar,
  ListSubheader, List, ListItem, ListItemIcon, ListItemText,
  Badge, FormControlLabel, Switch, Button
} from '@material-ui/core/';

import { AddAlert, ShowChart, VisibilityOutlined, DateRangeOutlined, Search, FindInPage, Code, TableChartOutlined, LibraryBooksOutlined, Menu, ChevronLeft } from '@material-ui/icons';
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
// import { HighlightSourcesLegend } from './HighlightSourcesLegend';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/agate';
import './Home.css'; //needed for iframe height
import { MonetizationModal } from './Demo/MonetizationModal';
import BottomBar from './Material/BottomBar';
import LookerUserPermissions from '../lookerUserPermissions.json';
import { lookerUserTimeHorizonMap } from '../App';




const drawerWidth = 240;
const { validIdHelper } = require('../tools');

const styles = theme => ({
  root: {
    display: 'flex',
    backgroundColor: 'rgb(229, 229, 229)'
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    zIndex: 1201,
    backgroundColor: "#343D4E"
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
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
    borderRight: 'none',
    backgroundColor: 'transparent'
  },
  drawerPaper: {
    width: drawerWidth,
    borderRight: 'none',
    backgroundColor: 'transparent'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
    // backgroundColor: '#343D4E',
    // color: '#ffff'
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
    backgroundColor: 'transparent'
    // theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  mlAuto: {
    marginLeft: 'auto'
  },
  mrAuto: {
    marginRight: 'auto'
  },
  appBarBottom: {
    top: 'auto',
    bottom: 0,
    // backgroundColor: 'transparent'
  },
  hidden: {
    visibility: 'hidden'
  },
  roundedTab: {
    borderRadius: '0 100px 100px 0'
  },
  paddingBottom30: {
    paddingBottom: 30
  },
  mtAuto: {
    marginTop: 'auto'
  },
  mb10: {
    marginBottom: 10
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
      drawerOpen: window.innerWidth > 768 ? true : false, //true,
      drawerTabValue: 0,
      activeTabValue: 0,
      activeUsecase: '',
      appLayout: '',
      highlightShow: false,
      payWallModal: {},
      selectedMenuItem: '',
      renderedDemoComponents: [],
      codeShow: false,
    }
  }

  togglePayWallModal = (modalContent) => {
    this.setState({ payWallModal: { ...modalContent } })
  }

  toggleHighlightShow = () => {
    // if (this.state.codeShow) this.toggleCodeShow()
    this.setState({ highlightShow: !this.state.highlightShow })
  }

  toggleCodeShow = () => {
    // console.log('toggleCodeShow')
    // console.log('000 toggleCodeShthis.state.codeShow', this.state.codeShow)

    this.setState({ codeShow: !this.state.codeShow })
    // console.log('1111 toggleCodeShthis.state.codeShow', this.state.codeShow)
  }

  handleTabChange = newValue => {
    this.setState({
      activeTabValue: newValue
    })
  }



  handleDrawerChange = (open) => {
    this.setState({
      drawerOpen: open
    })
  }

  handleMenuItemSelect = (newValue, fromSplash) => {
    // console.log('handleMenuItemSelect')
    this.handleTabChange(0)

    if (this.state.highlightShow) this.toggleHighlightShow()
    if (this.state.codeShow) this.toggleCodeShow()

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

    let renderedDemoComponentsCopy = [...this.state.renderedDemoComponents]
    if (renderedDemoComponentsCopy.indexOf(selectedMenuItemValue) == -1) renderedDemoComponentsCopy.unshift(selectedMenuItemValue)

    this.setState((prevState) => ({
      selectedMenuItem: selectedMenuItemValue,
      renderedDemoComponents: [...renderedDemoComponentsCopy]
    }))
  };

  componentDidMount(props) {

    // console.log('Home componentDidMount')
    // console.log('this.props', this.props)

    let { usecaseFromUrl } = this.props || 'atom';

    this.setState({
      activeUsecase: usecaseFromUrl,
      appLayout: UsecaseContent[usecaseFromUrl].layout || 'left-sidebar'
    }, () => {
      LookerEmbedSDK.init(`https://${this.props.lookerHost}.looker.com`, '/auth');
    })

    window.addEventListener("resize", () => {
      // console.log('resize event')
      this.setState({ drawerOpen: window.innerWidth > 768 ? true : false })
    });

  }

  componentDidUpdate(prevProps) {
    // console.log('componentDidUpdate')
    let prevPermissionLevel = prevProps.lookerUser.user_attributes.permission_level;
    let currPermissionLevel = this.props.lookerUser.user_attributes.permission_level;
    let prevUserBrand = prevProps.lookerUser.user_attributes.brand;
    let currUserBrand = this.props.lookerUser.user_attributes.brand;

    if ((prevPermissionLevel !== currPermissionLevel) || (prevUserBrand !== currUserBrand)) {
      // console.log('we are inside this iffff')
      LookerEmbedSDK.init(`https://${this.props.lookerHost}.looker.com`, '/auth');
      this.setState({
        renderedDemoComponents: [this.state.selectedMenuItem]
      })
    }
  }

  handleUserMenuSwitch = async (newValue, property) => {
    // console.log('handleUserMenuSwitch')
    // console.log('newValue', newValue)
    // console.log('property', property)
    //eg to review this 9/8
    let newLookerUser = { ...this.props.lookerUser }
    // console.log('new looker user',newLookerUser)
    if (property === 'brand') {
      newLookerUser.user_attributes.brand = newValue
    } else if (property === 'permission') {
      // console.log('permission',newValue)
      newLookerUser.permissions = LookerUserPermissions[newValue] || LookerUserPermissions['basic']
      newLookerUser.user_attributes.permission_level = newValue
      newLookerUser.user_attributes.time_horizon = lookerUserTimeHorizonMap[newValue]
    }
    const x = await fetch('/updatelookeruser', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newLookerUser)
    })
    // console.log(x)

    this.setState({
      renderedDemoComponents: [this.state.selectedMenuItem]
    }, () => {
      if (property === 'brand') {
        this.props.switchUserAttributeBrand(newValue);
      } else if (property === 'permission') {
        this.props.switchLookerUser(newValue);
      }
    })

  }




  render() {

    //how to make this dynamic????
    const demoComponentMap = {
      "splashpage19": SplashPage,
      "customfilter5": Dashboard,
      "simpledashboard9": Dashboard,
      "customfilter1": Dashboard,
      "customvis": CustomVis,
      "querybuilderexplorelite": QueryBuilder,
      "reportbuilder14": ReportBuilder,
    };

    const demoComponentKeyMap = ["splashpage19",
      "customfilter5",
      "simpledashboard9",
      "customfilter1",
      "customvis",
      "querybuilderexplorelite",
      "reportbuilder14"
    ]

    const themeMap = {
      "atom": atomTheme,
      "vidly": vidlyTheme
    }

    const { drawerTabValue, drawerOpen, activeTabValue, activeUsecase, selectedMenuItem, renderedDemoComponents } = this.state;
    const { handleTabChange, handleMenuItemSelect, handleDrawerChange } = this;
    const { classes, activeCustomization, lookerUser, applySession, lookerUserAttributeBrandOptions, lookerHost, userProfile, sdk } = this.props

    // console.log('accessToken', accessToken)


    // Use Lodash to sort array by 'name'
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


    if (activeUsecase && !selectedMenuItem.length) {
      let selectedMenuItemVal =
        UsecaseContent[activeUsecase].demoComponents[0].lookerContent[0].id ?
          validIdHelper(UsecaseContent[activeUsecase].demoComponents[0].type + UsecaseContent[activeUsecase].demoComponents[0].lookerContent[0].id) :
          validIdHelper(UsecaseContent[activeUsecase].demoComponents[0].type)
      this.setState({
        selectedMenuItem: selectedMenuItemVal,
        renderedDemoComponents: [selectedMenuItemVal]
      }, () => {
      })
    }

    return (
      <div className={classes.root} >
        <AppContext.Provider value={
          {
            show: this.state.highlightShow,
            toggleShow: this.toggleHighlightShow,
            payWallModal: this.state.payWallModal,
            togglePayWallModal: this.togglePayWallModal,
            lookerUser,
            userProfile,
            codeShow: this.state.codeShow,
            toggleCodeShow: this.toggleCodeShow,
            lookerHost,
            sdk,
            atomTheme: atomTheme
          }
        } >
          <ThemeProvider theme={activeUsecase ? themeMap[activeUsecase] : defaultTheme}>
            <CssBaseline />
            <TopBar {...this.props}
              classes={classes}
              activeUsecase={activeUsecase}
              lookerUser={lookerUser}
              applySession={applySession}
              lookerUserAttributeBrandOptions={lookerUserAttributeBrandOptions}
              handleUserMenuSwitch={this.handleUserMenuSwitch}
              handleDrawerChange={this.handleDrawerChange}
              drawerOpen={drawerOpen} />
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
                <IconButton onClick={() => handleDrawerChange(false)}>
                  <ChevronLeft />
                </IconButton>
              </div>

              {Object.keys(orderedDemoComponentsForMenuObj).length ?
                <MenuList {...this.props}
                  classes={classes}
                  activeUsecase={activeUsecase}
                  orderedDemoComponentsForMenuObj={orderedDemoComponentsForMenuObj}
                  selectedMenuItem={selectedMenuItem}
                  handleMenuItemSelect={handleMenuItemSelect}
                /> : ''}

              <MonetizationModal
                switchLookerUser={this.handleUserMenuSwitch}
              />
              <BottomBar classes={classes} lookerUser={lookerUser} />
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
                    <React.Fragment
                      key={validIdHelper(`outerFragment-${item.type}-${index}`)}>
                      {renderedDemoComponents.indexOf(key) > -1 ?
                        <Box key={validIdHelper(`box-${item.type}-${index}`)}
                          className={key === selectedMenuItem ? `` : `${classes.hide}`}
                        >
                          {/* {key === selectedMenuItem ? */}
                          <DemoComponent
                            key={validIdHelper(`demoComponent-${item.type}-${index}`)}
                            staticContent={item}
                            handleMenuItemSelect={handleMenuItemSelect}
                            activeTabValue={activeTabValue}
                            handleTabChange={handleTabChange}
                            lookerUser={lookerUser}
                            activeUsecase={activeUsecase}
                            lookerHost={lookerHost}
                            userProfile={userProfile}
                          />
                          {/* : ''} */}

                        </Box> : ''}
                    </React.Fragment>)
                }) :
                ''
              }
            </main >
            {/* <BottomBar classes={classes} lookerUser={lookerUser} /> */}
          </ThemeProvider>
        </AppContext.Provider>
      </div >
    )
  }
}
export default withStyles(styles)(Home);

function TopBar(props) {
  const { classes, activeUsecase, lookerUser, applySession, lookerUserAttributeBrandOptions, handleUserMenuSwitch, drawerOpen, handleDrawerChange } = props

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar)}
    // className={clsx(classes.appBar, {
    //   [classes.appBarShift]: drawerOpen,
    // })}
    >
      <Toolbar>

        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => handleDrawerChange(!drawerOpen)}
          edge="start"
        // className={clsx(classes.menuButton, drawerOpen && classes.hide)}
        >
          {drawerOpen ? <ChevronLeft /> : <Menu />}
          {/* <Menu /> */}
        </IconButton>

        {activeUsecase ?
          <Avatar alt="Icon"
            src={require(`../images/${activeUsecase}.svg`)}
            variant="square"
          /> : ''}

        <Badge badgeContent={3} color="error" className={`${classes.mlAuto} ${classes.mr12} `} >
          <AddAlert />
        </Badge>
        <UserMenu
          lookerUser={lookerUser}
          onLogoutSuccess={applySession}
          lookerUserAttributeBrandOptions={lookerUserAttributeBrandOptions}
          handleUserMenuSwitch={handleUserMenuSwitch}
        />
      </Toolbar>
    </AppBar>
  )
}

function MenuList(props) {
  // const { toggleShow } = useContext(AppContext)
  // const { show } = useContext(AppContext)
  // const { codeShow } = useContext(AppContext)
  const { classes, activeUsecase, orderedDemoComponentsForMenuObj, selectedMenuItem, handleMenuItemSelect } = props
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
          // className={'roundedTab'}
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