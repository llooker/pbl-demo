import _ from 'lodash'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useHistory, useParams, useLocation } from "react-router-dom";
import AppContext from '../../contexts/AppContext';
import { createSdkHelper } from '../../AuthUtils/auth';
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


  //state
  const didMountRef = useRef(false)
  const [drawerOpen, setDrawerOpen] = useState(window.innerWidth > 768 ? true : false);
  const [activeUsecase, setActiveUsecase] = useState(usecaseHelper(UsecaseContent));
  const [highlightShow, setHighlightShow] = useState(false);
  const [codeShow, setCodeShow] = useState(false);
  const [payWallModal, setPaywallModal] = useState({});
  const [selectedMenuItem, setSelectedMenuItem] = useState(democomponent);

  const handleMenuItemSelect = (newValue, fromSplash) => {

    // console.log('handleMenuItemSelect');
    // console.log('newValue', newValue);
    // console.log('fromSplash', fromSplash);

    if (highlightShow) setHighlightShow(!highlightShow);
    if (codeShow) setCodeShow(!codeShow);

    let selectedMenuItemValue = '';

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
    setSelectedMenuItem(selectedMenuItemValue)
  };

  const handleSwitchLookerUser = async (newValue, property) => {

    // console.log('handleSwitchLookerUser');
    // console.log('newValue', newValue);
    // console.log('property', property);

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

  //Q for nick -- is this the best place to do this???
  const corsApiCall = async (func, args = []) => {
    await checkToken()
    let res = func(...args)
    return res
  }

  const checkToken = async () => {
    console.log('checkToken')

    console.log("sdk.ok") //leave for now
    console.log(sdk.ok)

    if (clientSession.lookerApiToken.requires_refresh || Date.now() > clientSession.lookerApiToken.expires_in) {
      console.log("inside checkToken iff")
      let sessionResponse = await fetch('/refreshlookertoken', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      const sessionResponseData = await sessionResponse.json();
      const lookerHost = sessionResponseData.session.lookerHost ? sessionResponseData.session.lookerHost : this.state.lookerHost;
      const accessToken = sessionResponseData.session.lookerApiToken ? sessionResponseData.session.lookerApiToken.api_user_token : '';
      const sdk = createSdkHelper({ lookerHost, accessToken })
      setSdk(sdk);
      setClientSession(sessionResponseData.session)

    }
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
    setSelectedMenuItem(democomponent)
  }, [democomponent])

  // useEffect(() => {
  //   console.log('handleMenuItemSelect useEffect ')
  //   console.log({ selectedMenuItem })
  // }, [selectedMenuItem])


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

  console.log({ DemoComponentContent })


  return (
    <div className={classes.root} >

      <AppContext.Provider value={{
        clientSession, setClientSession,
        payWallModal, setPaywallModal,
        handleSwitchLookerUser,
        drawerOpen, setDrawerOpen,
        activeUsecase,
        selectedMenuItem, handleMenuItemSelect,
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