import _ from 'lodash'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useHistory, useParams, useLocation } from "react-router-dom";
import AppContext from '../../contexts/AppContext';
import { checkToken } from '../../AuthUtils/auth';
import UsecaseContent from '../../usecaseContent.json';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core/';
import clsx from 'clsx';
import { useStyles, defaultTheme, atomTheme } from './styles.js';
import { lookerUserPermissions, lookerUserTimeHorizonMap } from '../../LookerHelpers/defaults';

import TopBar from './TopBar';
import LeftDrawer from './LeftDrawer';
import { MonetizationModal } from '../Demo/MonetizationModal/MonetizationModal';

import SplashPage from '../Demo/SplashPage/SplashPage';
import Dashboard from '../Demo/Dashboard/Dashboard';
import CustomVis from '../Demo/CustomVis/CustomVis';
import ReportBuilder from '../Demo/ReportBuilder/ReportBuilder';
import QueryBuilder from '../Demo/QueryBuilder/QueryBuilder';
import '../Home.css';

const { validIdHelper, usecaseHelper } = require('../../tools');


export default function Home(props) {
  // console.log("Home")
  let { setClientSession, clientSession, sdk, setSdk } = useContext(AppContext)
  let { democomponent } = useParams();
  const classes = useStyles();

  const didMountRef = useRef(false)
  const [drawerOpen, setDrawerOpen] = useState(window.innerWidth > 768 ? true : false);
  const [activeUsecase, setActiveUsecase] = useState(usecaseHelper(UsecaseContent));
  const [highlightShow, setHighlightShow] = useState(false);
  const [codeShow, setCodeShow] = useState(false);
  const [payWallModal, setPaywallModal] = useState({});
  const [selectedMenuItem, setSelectedMenuItem] = useState(democomponent);

  const handleSwitchLookerUser = async (newValue, property) => {

    let newLookerUser = { ...clientSession.lookerUser }
    if (property === 'brand') {
      newLookerUser.user_attributes.brand = newValue
    } else if (property === 'permission') {
      newLookerUser.permissions = lookerUserPermissions[newValue] || lookerUserPermissions['basic']
      newLookerUser.user_attributes.permission_level = newValue
      newLookerUser.user_attributes.time_horizon = lookerUserTimeHorizonMap[newValue]
    }

    const lookerUserResponse = await fetch('/updatelookeruser', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newLookerUser)
    })

    let lookerUserResponseData = await lookerUserResponse.json();
    setClientSession(lookerUserResponseData.session);
  }


  const corsApiCall = async (func, args = []) => {
    let checkTokenRsp = await checkToken(sdk);
    if (checkTokenRsp.sdk) setSdk(checkTokenRsp.sdk)
    if (checkTokenRsp.clientSession) setClientSession(checkTokenRsp.clientSession)
    let res = func(...args)
    return res
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


  useEffect(() => {

    if (highlightShow) setHighlightShow(!highlightShow);
    if (codeShow) setCodeShow(!codeShow);

    setSelectedMenuItem(democomponent)
  }, [democomponent])

  useEffect(() => {
    localStorage.setItem("clientSession", JSON.stringify(clientSession)) //for now

  }, [clientSession])


  const themeMap = {
    "atom": atomTheme,
  }

  const demoComponentMap = {
    "splashpage19": SplashPage,
    "customfilter5": Dashboard,
    "simpledashboard9": Dashboard,
    "customfilter1": Dashboard,
    "customvis": CustomVis,
    "querybuilderexplorelite": QueryBuilder,
    "reportbuilder14": ReportBuilder,
  };


  const DemoComponent = demoComponentMap[selectedMenuItem];
  const DemoComponentContent = _.find(UsecaseContent[activeUsecase].demoComponents, (o) => {
    return selectedMenuItem === validIdHelper(o.type + o.lookerContent[0].id) || selectedMenuItem === validIdHelper(o.type)
  });

  return (
    <div className={classes.root} >

      <AppContext.Provider value={{
        clientSession, setClientSession,
        payWallModal, setPaywallModal,
        handleSwitchLookerUser,
        drawerOpen, setDrawerOpen,
        activeUsecase,
        selectedMenuItem,
        highlightShow, setHighlightShow,
        codeShow, setCodeShow,
        sdk,
        corsApiCall,
        atomTheme
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
            {DemoComponentContent ? <DemoComponent staticContent={DemoComponentContent} /> : ''}
          </main>
        </ThemeProvider>
      </AppContext.Provider>
    </div>
  )
}