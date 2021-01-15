import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  AppBar, Toolbar, Badge, Avatar, IconButton
} from '@material-ui/core/';
import { AddAlert, ChevronLeft, Menu } from '@material-ui/icons';
import AppContext from '../../contexts/AppContext';
import { useStyles } from './styles.js';
import UserMenu from './UserMenu';

import { TopBarContent } from '../../config/TopBarContent';
import { AutoComplete } from '@pbl-demo/components';

export default function TopBar(props) {
  const classes = useStyles();

  let { clientSession, setClientSession,
    drawerOpen, setDrawerOpen,
    sdk, corsApiCall
  } = useContext(AppContext)
  const { packageName } = clientSession;
  const [apiContent, setApiContent] = useState(undefined);

  useEffect(() => {
    if (TopBarContent.hasOwnProperty("autocomplete")) retrieveAutocompleteOptions()
  }, [])


  const retrieveAutocompleteOptions = async () => {
    let lookerResponseData = await sdk.ok(sdk.run_inline_query({ result_format: TopBarContent.autocomplete[0].resultFormat || "json", body: TopBarContent.autocomplete[0].inlineQuery }))
    let orderedArrayForApiContent = []
    let queryResultsForDropdown = [];
    let desiredProperty = Object.keys(lookerResponseData[0])[0];

    for (let i = 0; i < lookerResponseData.length; i++) {
      queryResultsForDropdown.push({
        'label': lookerResponseData[i][desiredProperty].toString(),
        'trend': (lookerResponseData[i]['trend']) ? lookerResponseData[i]['trend'] : undefined
      })
    }
    orderedArrayForApiContent = queryResultsForDropdown;
    setApiContent(orderedArrayForApiContent)
  }

  useEffect(() => {
    console.log({ apiContent })
  }, [apiContent])

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

        {TopBarContent.autocomplete ? <AutoComplete lookerContent={TopBarContent.autocomplete}
          apiContent={apiContent}
          index={0}
          action={() => { console.log("test") }} classes={classes} /> : ""}

        <Badge badgeContent={3} color="error" className={`${classes.mlAuto} ${classes.mr12} `} >
          <AddAlert />
        </Badge>
        <UserMenu />
      </Toolbar>
    </AppBar>
  )
}

