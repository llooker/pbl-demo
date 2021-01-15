import _ from 'lodash'
import React, { useContext, useEffect, useState } from 'react';
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

console.log({ TopBarContent })

export default function TopBar(props) {
  const classes = useStyles();

  let { clientSession, setClientSession,
    drawerOpen, setDrawerOpen,
    sdk, corsApiCall
  } = useContext(AppContext)
  const { packageName } = clientSession
  const [apiContent, setApiContent] = useState(undefined);

  useEffect(() => {
    if (TopBarContent && TopBarContent.length) {
      let autocompleteFilterItem = _.find(TopBarContent, { component: "autocomplete" });
      if (autocompleteFilterItem) retrieveAutocompleteOptions()
    }
  }, [])

  const retrieveAutocompleteOptions = async () => {
    let lookerResponseData = await sdk.ok(sdk.run_inline_query({ result_format: TopBarContent[0].resultFormat || "json", body: TopBarContent[0].inlineQuery }))
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
    setApiContent(apiContentObj)
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

        {apiContent && apiContent.autocomplete ?
          <Grid item sm={3} className={classes.mlAuto}>
            <AutoComplete
              filterItem={TopBarContent[0]}
              apiContent={apiContent.autocomplete}
              action={() => { console.log("test") }} // for now
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

