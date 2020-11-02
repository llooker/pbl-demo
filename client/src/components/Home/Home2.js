import React, { useState, useEffect, useContext, useRef } from 'react';
import { useHistory, useParams } from "react-router-dom";
import AppContext from '../../contexts/AppContext';
import { endSession } from '../../AuthUtils/auth';
import UsecaseContent from '../../usecaseContent.json';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { ThemeProvider } from '@material-ui/core/styles';
import {
  Drawer, CssBaseline, AppBar, Toolbar, Typography,
  Divider, IconButton, Tabs, Tab, Icon, Box, Avatar,
  ListSubheader, List, ListItem, ListItemIcon, ListItemText,
  Badge, FormControlLabel, Switch, Button
} from '@material-ui/core/';
import { AddAlert, ShowChart, VisibilityOutlined, DateRangeOutlined, Search, FindInPage, Code, TableChartOutlined, LibraryBooksOutlined, Menu, ChevronLeft } from '@material-ui/icons';
import clsx from 'clsx';
import { useStyles, defaultTheme, atomTheme } from './styles.js';
import TopBar from './TopBar';
import LeftDrawer from './LeftDrawer';
import { MonetizationModal } from '../Demo/MonetizationModal/MonetizationModal';
import LookerUserPermissions from '../../lookerUserPermissions.json';
import lookerUserTimeHorizonMap from '../../lookerUserTimeHorizonMap.json';

import '../Home.css';

const { validIdHelper, usecaseHelper } = require('../../tools');

console.log({ usecaseHelper })

export default function Home(props) {
  console.log("Home")

  let { democomponent } = useParams();
  console.log('democomponent', democomponent)

  let history = useHistory();
  let { setClientSession, clientSession } = useContext(AppContext)
  const classes = useStyles();

  //state
  const didMountRef = useRef(false)
  const [drawerOpen, setDrawerOpen] = useState(window.innerWidth > 768 ? true : false);
  const [activeTabValue, setActiveTabValue] = useState(0);
  const [activeUsecase, setActiveUsecase] = useState(usecaseHelper(UsecaseContent));
  const [highlightShow, setHighlightShow] = useState(false);
  const [codeShow, setCodeShow] = useState(false);
  const [payWallModal, setPaywallModal] = useState({});
  const [selectedMenuItem, setSelectedMenuItem] = useState('');
  const [renderedDemoComponents, setRenderedDemoComponents] = useState([]);

  //functions
  const togglePayWallModal = (modalContent) => {
    setPaywallModal({ ...modalContent })
  }
  const toggleHighlightShow = () => {
    setHighlightShow(!highlightShow)
  }
  const toggleCodeShow = () => {
    setCodeShow(!codeShow)
  }
  const handleTabChange = (newValue) => {
    setActiveTabValue(newValue)
  }

  // const handleDrawerChange = (open) => {
  //   setDrawerOpen(open);
  // }

  const handleMenuItemSelect = (newValue, fromSplash) => {
    // console.log("handleMenuItemSelect");
    // console.log("newValue", newValue);
    // console.log("fromSplash", fromSplash);
    handleTabChange(0)

    if (highlightShow) toggleHighlightShow()
    if (codeShow) toggleCodeShow()

    let selectedMenuItemValue = ''
    if (fromSplash) {
      UsecaseContent[activeUsecase].demoComponents.map(item => {
        if (item.type !== "splash page") {
          item.lookerContent.map(lookerContentItem => {
            if (lookerContentItem.id === newValue) {
              selectedMenuItemValue = validIdHelper(item.type + lookerContentItem.id)
            }
          })
        }
      })
    } else selectedMenuItemValue = newValue;

    let renderedDemoComponentsCopy = [...renderedDemoComponents]
    if (renderedDemoComponentsCopy.indexOf(selectedMenuItemValue) == -1) renderedDemoComponentsCopy.unshift(selectedMenuItemValue)

    setSelectedMenuItem(selectedMenuItemValue)
    setRenderedDemoComponents([...renderedDemoComponentsCopy])
  };

  const handleSwitchLookerUser = async (newValue, property) => {
    let newLookerUser = { ...clientSession.lookerUser }
    if (property === 'brand') {
      newLookerUser.user_attributes.brand = newValue
    } else if (property === 'permission') {
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
  }

  //componentDidMount
  useEffect(() => {
    const usecaseFromUrl = usecaseHelper(UsecaseContent);
    setActiveUsecase(usecaseFromUrl);

    LookerEmbedSDK.init(`https://${clientSession.lookerHost}.looker.com`, '/auth');

    window.addEventListener("resize", () => {
      setDrawerOpen(window.innerWidth > 768 ? true : false)
    });

  }, [])

  //componentDidUpdate
  useEffect(() => {
    if (didMountRef.current) {
      // doStuff()
    } else didMountRef.current = true
  })


  const themeMap = {
    "atom": atomTheme,
    // "vidly": vidlyTheme
  }

  useEffect(() => {
    if (selectedMenuItem) {
      history.push(`/analytics/${selectedMenuItem}`)
    }
  }, [selectedMenuItem])

  if (activeUsecase && !selectedMenuItem.length) {
    let selectedMenuItemVal =
      UsecaseContent[activeUsecase].demoComponents[0].lookerContent[0].id ?
        validIdHelper(UsecaseContent[activeUsecase].demoComponents[0].type + UsecaseContent[activeUsecase].demoComponents[0].lookerContent[0].id) :
        validIdHelper(UsecaseContent[activeUsecase].demoComponents[0].type)
    setSelectedMenuItem(selectedMenuItemVal)
    setRenderedDemoComponents([selectedMenuItemVal])
  }


  console.log({ activeUsecase })

  return (
    <div className={classes.root} >

      <AppContext.Provider value={{
        clientSession, setClientSession,
        payWallModal, togglePayWallModal,
        handleSwitchLookerUser,
        drawerOpen, setDrawerOpen,
        activeUsecase,
        selectedMenuItem, handleMenuItemSelect,
        // renderedDemoComponents, setRenderedDemoComponents
      }}>
        <ThemeProvider theme={activeUsecase ? themeMap[activeUsecase] : defaultTheme}>
          <CssBaseline />

          <TopBar />

          <MonetizationModal />

          <LeftDrawer />


          <main
            className={clsx(classes.content, {
              [classes.contentShift]: drawerOpen,
            })}
          >
            <div className={classes.drawerHeader} />

            {selectedMenuItem}
          </main>

        </ThemeProvider>
      </AppContext.Provider>
    </div>
  )
}
