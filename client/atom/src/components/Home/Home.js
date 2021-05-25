import _ from 'lodash'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useHistory } from "react-router-dom";
import AppContext from '../../contexts/AppContext';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { CssBaseline } from '@material-ui/core/';
import clsx from 'clsx';
import '../Home.css';
import * as DemoComponentsContentArr from '../../config/Demo';
import { TopBarContent } from '../../config/TopBarContent';
import { checkToken, endSession } from '@pbl-demo/utils/auth';
import { permissionLevels, userTimeHorizonMap, modalPermissionsMap } from '../../config';
import { UserPermissionsModal } from "@pbl-demo/components/Accessories";
import { TopBar, BottomBar, LeftDrawer, TopDrawer } from "@pbl-demo/components";
import { errorHandler } from '@pbl-demo/utils'
import { useStyles, topAndBottomHeaderPlusDrawerOpen, topAndBottomHeaderSpacing } from './styles.js';

const { validIdHelper } = require('../../tools');


export default function Home(props) {
  // console.log("Home")
  let { setClientSession, clientSession, clientSession: { packageName }, sdk, setSdk, isReady, setIsReady, theme } = useContext(AppContext)
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
    //decorator approach??
    try {
      let checkTokenRsp = await checkToken(clientSession.lookerApiToken.expires_in || Date.now() - 1000);
      //new method of signing user out
      if (checkTokenRsp.status === 'expired') {
        setIsReady(false);
        endSession();
        setClientSession({});
        setSdk();
        history.push("/");
      } else {
        let res = func(...args)
        return res
      }
    } catch (err) {
      errorHandler.report(err)
      // endSession();
      // setClientSession({})
      // history.push("/");
    }
  }

  useEffect(() => {

    let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
    LookerEmbedSDK.init(modifiedBaseUrl, '/auth')

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
        setSdk, sdk,
        corsApiCall,
        theme,
        isReady, setIsReady,
      }}>
        <CssBaseline />
        <TopBar
          content={topBarContent}
          theme={theme}
          classes={classes}
        />
        <UserPermissionsModal content={{ permissionLevels, modalPermissionsMap }} classes={classes} />

        {/* conditional rendering for now */}
        {packageName === "vision" ?
          <TopDrawer DemoComponentsContentArr={demoComponentsContentArr} classes={classes} /> :
          <LeftDrawer DemoComponentsContentArr={demoComponentsContentArr} classes={classes} />}
        <main
          className={packageName === "vision" ? clsx(classes.topContent, {
            [classes.topContentShift]: drawerOpen,
          }) : clsx(classes.leftContent, {
            [classes.leftContentShift]: drawerOpen,
          })}
        >

          <div className={classes.drawerHeader} />
          {ActiveDemoComponent ? <ActiveDemoComponent
            staticContent={ActiveDemoComponentContent}
            dynamicPadding={drawerOpen && packageName === "vision" ? topAndBottomHeaderPlusDrawerOpen : topAndBottomHeaderSpacing} /> : ''}
        </main>

        <BottomBar classes={classes} />
      </AppContext.Provider>
    </div>
  )
}