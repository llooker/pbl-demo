import React, { useState, useEffect, useContext, useRef } from 'react';
import { useHistory, } from "react-router-dom";
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
import { useStyles, defaultTheme, atomTheme } from './styles.js';
import TopBar from './TopBar';

import '../Home.css';

const { validIdHelper, usecaseHelper } = require('../../tools');


export default function Home(props) {

  let history = useHistory();
  let { setClientSession, clientSession } = useContext(AppContext)
  const classes = useStyles();

  //state
  const didMountRef = useRef(false)
  const [drawerOpen, setDrawerOpen] = useState(window.innerWidth > 768 ? true : false);
  const [activeTabValue, setActiveTabValue] = useState(0);
  const [activeUsecase, setActiveUsecase] = useState('');
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
  const handleDrawerChange = (open) => {
    setDrawerOpen(open);
  }
  const handleMenuItemSelect = (newValue, fromSplash) => {
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

  //componentDidMount
  useEffect(() => {
    const usecaseFromUrl = usecaseHelper(UsecaseContent);
    setActiveUsecase(usecaseFromUrl);

    LookerEmbedSDK.init(`https://${clientSession.lookerHost}.looker.com`, '/auth');

    window.addEventListener("resize", () => {
      // console.log('resize event')
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

  return (
    <div className={classes.root} >

      <AppContext.Provider value={{
        clientSession, setClientSession
      }}>
        <ThemeProvider theme={activeUsecase ? themeMap[activeUsecase] : defaultTheme}>
          <CssBaseline />

          {/* <h1>analytics</h1>
          <button onClick={() => {
            setClientSession({})
            history.push("/")
            endSession();
          }}>Logout</button> */}


          <TopBar
            // {...this.props}
            classes={classes}
            activeUsecase={activeUsecase}
            lookerUser={clientSession.lookerUser}
            // applySession={applySession}
            // lookerUserAttributeBrandOptions={lookerUserAttributeBrandOptions}
            // handleUserMenuSwitch={this.handleUserMenuSwitch}
            // handleDrawerChange={this.handleDrawerChange}
            drawerOpen={drawerOpen}
          />
        </ThemeProvider>
      </AppContext.Provider>
    </div>
  )
}
