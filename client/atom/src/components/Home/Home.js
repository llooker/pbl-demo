import _ from 'lodash'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useHistory } from "react-router-dom";
import AppContext from '../../contexts/AppContext';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core/';
import clsx from 'clsx';
import LeftDrawer from './LeftDrawer';
import '../Home.css';
import { useStyles } from './styles.js';
import { packageNameTheme } from '../../config/theme.js';
import * as DemoComponentsContentArr from '../../config/Demo';
import { TopBar, BottomBar } from "@pbl-demo/components";
import { TopBarContent } from '../../config/TopBarContent';
import { checkToken, endSession } from '@pbl-demo/utils/auth';
import { permissionLevels, userTimeHorizonMap, modalPermissionsMap } from '../../config';
import { UserPermissionsModal } from "@pbl-demo/components/Accessories";
const { validIdHelper } = require('../../tools');

export default function Home(props) {
  // console.log("Home")
  let { setClientSession, clientSession, sdk, setSdk, isReady, setIsReady } = useContext(AppContext)
  let { democomponent } = useParams();
  let history = useHistory();
  const classes = useStyles();
  const didMountRef = useRef(false)
  const [drawerOpen, setDrawerOpen] = useState(window.innerWidth > 768 ? true : false);
  const [highlightShow, setHighlightShow] = useState(false);
  const [codeShow, setCodeShow] = useState(false);
  const [payWallModal, setPaywallModal] = useState({});
  const [selectedMenuItem, setSelectedMenuItem] = useState(democomponent);

  const { lookerUser: { user_attributes: { permission_level } } = { user_attributes: 'No match' } } = clientSession;
  const currentPermissionLevel = Object.keys(permissionLevels).indexOf(permission_level);
  const demoComponentsContentArr = _.filter(DemoComponentsContentArr, demoComponent => demoComponent.requiredPermissionLevel <= currentPermissionLevel);
  let topBarContent = { ...TopBarContent };
  if (topBarContent.autocomplete && currentPermissionLevel < topBarContent.autocomplete.correspondingComponentContent.requiredPermissionLevel) {
    delete topBarContent.autocomplete
  }

  const handleSwitchLookerUser = async (newValue, property) => {

    let newLookerUser = { ...clientSession.lookerUser }
    if (property === 'brand') {
      newLookerUser.user_attributes.brand = newValue
    } else if (property === 'permission') {
      newLookerUser.permissions = permissionLevels[newValue]
      newLookerUser.user_attributes.permission_level = newValue
      newLookerUser.user_attributes.time_horizon = userTimeHorizonMap[newValue]
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
    // console.log("corsApiCall");

    let checkTokenRsp = await checkToken(clientSession.lookerApiToken.expires_in);
    //old method of renewing token and client session
    // if (checkTokenRsp.sdk) {
    //   setSdk(checkTokenRsp.sdk)
    // }
    // if (checkTokenRsp.clientSession) {
    //   setClientSession(checkTokenRsp.clientSession)
    // }

    //new method of signing user out
    if (checkTokenRsp.status === 'expired') {
      setIsReady(false);
      endSession();
      setClientSession({})
      history.push("/");
    } else {
      let res = func(...args)
      return res
    }
  }

  useEffect(() => {

    let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
    LookerEmbedSDK.init(modifiedBaseUrl, '/auth')

    //listen to resize event
    window.addEventListener("resize", () => {
      setDrawerOpen(window.innerWidth > 768 ? true : false)
    });

    //listen to refresh or closing tab event
    //comment out for now
    // window.addEventListener("beforeunload", (e) => {
    //   setIsReady(false);
    //   endSession();
    //   setClientSession({})
    //   history.push("/");
    //   delete e['returnValue'];
    // });

  }, []) //onload

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

  let ActiveDemoComponent;
  const ActiveDemoComponentContent = _.find(demoComponentsContentArr, (o) => {
    return selectedMenuItem === validIdHelper(_.lowerCase(o.label))
  });
  if (!ActiveDemoComponentContent) history.push(validIdHelper(_.lowerCase(demoComponentsContentArr[0].label)))
  else ActiveDemoComponent = ActiveDemoComponentContent.component;

  return (
    <div className={classes.root} >

      <AppContext.Provider value={{
        clientSession, setClientSession,
        payWallModal, setPaywallModal,
        handleSwitchLookerUser,
        drawerOpen, setDrawerOpen,
        selectedMenuItem,
        highlightShow, setHighlightShow,
        codeShow, setCodeShow,
        sdk,
        corsApiCall,
        theme: packageNameTheme,
        isReady, setIsReady
      }}>
        <ThemeProvider theme={packageNameTheme}>
          <CssBaseline />
          <TopBar
            content={topBarContent}
            theme={packageNameTheme}
            classes={classes}
          />
          <UserPermissionsModal content={{ permissionLevels, modalPermissionsMap }} classes={classes} />
          <LeftDrawer DemoComponentsContentArr={demoComponentsContentArr} />
          <main
            className={clsx(classes.content, {
              [classes.contentShift]: drawerOpen,
            })}
          >

            <div className={classes.drawerHeader} />
            {ActiveDemoComponent ? <ActiveDemoComponent staticContent={ActiveDemoComponentContent} /> : ''}
          </main>

          <BottomBar classes={classes} />
        </ThemeProvider>
      </AppContext.Provider>
    </div>
  )
}