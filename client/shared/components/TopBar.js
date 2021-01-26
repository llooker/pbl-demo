import _ from 'lodash'
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import clsx from 'clsx';
import { AppBar, Toolbar, Badge, Avatar, IconButton, Grid } from '@material-ui/core';
import { AddAlert, ChevronLeft, Menu } from '@material-ui/icons';
import { UserMenu } from './UserMenu';
import { AutoComplete } from '@pbl-demo/components/Filters';
import { appContextMap } from '../utils/tools';
import { ThemeProvider } from '@material-ui/core/styles';

export const TopBar = ({ content, theme, classes }) => {
  // console.log("TopBar")
  // console.log({ theme })
  let history = useHistory();

  const { clientSession, setClientSession,
    drawerOpen, setDrawerOpen,
    sdk, corsApiCall, isReady } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME])
  const { userProfile, lookerUser } = clientSession;

  const { packageName } = clientSession
  const [apiContent, setApiContent] = useState(undefined);

  useEffect(() => {
    if (isReady && content && content.hasOwnProperty("autocomplete")) {
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
    let autoComplteInfo = content.autocomplete
    let lookerResponseData = await sdk.ok(sdk.run_inline_query({ result_format: autoComplteInfo.resultFormat || "json", body: autoComplteInfo.inlineQuery }))
    let apiContentObj = {}
    let queryResultsForDropdown = [];
    for (let i = 0; i < lookerResponseData.length; i++) {
      let formattedLabel = autoComplteInfo.formattedLabel.map(field => lookerResponseData[i][field]).join(", ")
      let value = autoComplteInfo.value.map(value => lookerResponseData[i][value]).toString();
      queryResultsForDropdown.push({
        'value': value,
        'label': formattedLabel,
        'trend': (lookerResponseData[i]['trend']) ? lookerResponseData[i]['trend'] : undefined
      })
    }
    apiContentObj["autocomplete"] = queryResultsForDropdown
    return apiContentObj;
  }

  const filterNamesUrlsMap = {
    "Household ID": "households"
  }

  return (
    <ThemeProvider theme={theme}>
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
              src={require(`../../${process.env.REACT_APP_PACKAGE_NAME}/src/images/logo.svg`).default}
              variant="square"
            /> : ''}

          {apiContent && apiContent.autocomplete ?
            <Grid item sm={2} className={`${classes.mlAuto} ${classes.mr12}`}>
              <AutoComplete
                filterItem={content.autocomplete}
                apiContent={apiContent.autocomplete}
                action={(filterName, newValue) => {
                  if (filterName && newValue) {
                    history.push({
                      pathname: filterNamesUrlsMap[filterName],
                      search: (`${encodeURIComponent(filterName)}=${newValue}`)
                    })
                  }
                }}
                classes={classes}
                bgColor={"white"}
              /></Grid> : ""}

          <Badge badgeContent={3} color="error" className={apiContent && apiContent.autocomplete ? `${classes.mr12}` : `${classes.mlAuto} ${classes.mr12}`} >
            <AddAlert />
          </Badge>
          <UserMenu classes={classes} />
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  )
}

