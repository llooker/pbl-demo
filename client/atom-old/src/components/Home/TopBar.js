import _ from 'lodash'
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, } from "react-router-dom";
import clsx from 'clsx';
import {
  AppBar, Toolbar, Badge, Avatar, IconButton, Grid
} from '@material-ui/core/';
import { AddAlert, ChevronLeft, Menu } from '@material-ui/icons';
import AppContext from '../../contexts/AppContext';
import { useStyles } from './styles.js';
import UserMenu from './UserMenu';
import { TopBarContent } from '../../config/TopBarContent';
import { AutoComplete } from '@pbl-demo/components/Filters';
import { urlencoded } from 'body-parser';

export default function TopBar(props) {
  const classes = useStyles();
  let history = useHistory();

  let { clientSession, setClientSession,
    drawerOpen, setDrawerOpen,
    sdk, corsApiCall, isReady
  } = useContext(AppContext)
  const { userProfile, lookerUser } = clientSession;

  const { packageName } = clientSession
  const [apiContent, setApiContent] = useState(undefined);

  useEffect(() => {
    if (isReady && TopBarContent && TopBarContent.hasOwnProperty("autocomplete")) {
      let isSubscribed = true
      corsApiCall(retrieveAutocompleteOptions).then(response => {
        if (isSubscribed) {
          setApiContent(response)
        }
      })
      return () => isSubscribed = false
    }
  }, [lookerUser, isReady])



  const retrieveAutocompleteOptions = async () => {
    let autoComplteInfo = TopBarContent.autocomplete
    let lookerResponseData = await sdk.ok(sdk.run_inline_query({ result_format: autoComplteInfo.resultFormat || "json", body: autoComplteInfo.inlineQuery }))
    let apiContentObj = {}
    let queryResultsForDropdown = [];
    let desiredProperty = Object.keys(lookerResponseData[0])[0];

    for (let i = 0; i < lookerResponseData.length; i++) {
      queryResultsForDropdown.push({
        'label': lookerResponseData[i][desiredProperty].toString(),
        'trend': (lookerResponseData[i]['trend']) ? lookerResponseData[i]['trend'] : undefined
      })
    }
    apiContentObj["autocomplete"] = queryResultsForDropdown
    return apiContentObj;
  }
  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar)}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => setDrawerOpen(!drawerOpen)}
          edge="start"
        >
          {drawerOpen ? <ChevronLeft /> : <Menu />}
        </IconButton>

        {packageName ?
          <Avatar alt="Icon"
            src={require(`../../images/logo.svg`).default}
            variant="square"
          /> : ''}

        {apiContent && apiContent.autocomplete ?
          <Grid item sm={3} className={classes.mlAuto}>
            <AutoComplete
              filterItem={TopBarContent.autocomplete}
              apiContent={apiContent.autocomplete}
              action={(filterName, newValue) => {
                console.log({ filterName })
                console.log({ newValue })
                history.push({ search: encodeURIComponent(`${filterName}=${newValue}`) })
              }}
              classes={classes}
            /></Grid> : ""}

        <Badge badgeContent={3} color="error" className={`${classes.mlAuto} ${classes.mr12} `} >
          <AddAlert />
        </Badge>
        <UserMenu />
      </Toolbar>
    </AppBar>
  )
}

