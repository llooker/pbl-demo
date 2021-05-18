import _ from 'lodash'
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, Link } from "react-router-dom";
import clsx from 'clsx';
import { AppBar, Toolbar, Badge, Avatar, IconButton, Grid, Typography, Container, Box } from '@material-ui/core';
import { AddAlert, ChevronLeft, KeyboardArrowDown, Menu } from '@material-ui/icons';
import { UserMenu } from './UserMenu';
import { AutoComplete } from './Filters';
import { appContextMap } from '../utils/tools';
import { ThemeProvider } from '@material-ui/core/styles';

export const TopBar = ({ content, theme, classes }) => {
  console.log("TopBar")
  console.log({ theme })
  console.log({ content })

  let history = useHistory();

  const { clientSession, clientSession: { packageName }, setClientSession, drawerOpen, setDrawerOpen,
    sdk, corsApiCall, isReady } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME])
  const { userProfile, lookerUser } = clientSession;
  const [apiContent, setApiContent] = useState(undefined);
  const [dynamicSearch, setDynamicSearch] = useState(undefined);

  useEffect(() => {
    if (isReady && content && content.hasOwnProperty("autocomplete")) {
      let isSubscribed = true
      corsApiCall(retrieveAutocompleteOptions, [dynamicSearch]).then(response => {
        if (isSubscribed) {
          setApiContent(response)
        }
      })
      return () => isSubscribed = false
    }
  }, [lookerUser, isReady, dynamicSearch]);

  const retrieveAutocompleteOptions = async (inputValue) => {


    let autoComplteInfo = content.autocomplete;
    let queryToUse = autoComplteInfo.inlineQuery;
    if (inputValue) {
      queryToUse.filters["person._search"] = `%${inputValue}%`
    }
    let lookerResponseData = await sdk.ok(sdk.run_inline_query({ result_format: autoComplteInfo.resultFormat || "json", body: queryToUse }))
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
    };
    apiContentObj["autocomplete"] = queryResultsForDropdown
    return apiContentObj;
  }

  const filterNamesUrlsMap = {
    "Person ID": "beneficiary"
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="fixed"
        className={`${clsx(classes.appBar)}`}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={(event) => {
              setDrawerOpen(!drawerOpen)
            }}
            edge="start"
            className={classes.padding0}
          >
            {drawerOpen ?
              packageName === "vision" ?
                <KeyboardArrowDown /> :
                <ChevronLeft /> :
              <Menu />}
          </IconButton>


          <IconButton
            component={Link}
            to='/home'
            color="inherit"
          >
            {content.avatar ?
              <Avatar alt="Icon"
                src={content.avatar}
                style={content.avatarStyle ? content.avatarStyle : ""}
                variant="square"
              /> : ""}

            {content.label ? <Typography className={classes.ml12} variant="h6">{content.label}</Typography> : ""}
          </IconButton>

          {apiContent && apiContent.autocomplete ?
            <Grid item sm={6} className={`${classes.mlAuto} ${classes.mr12} ${classes.p30}`}>
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
                setDynamicSearch={setDynamicSearch}
              /></Grid> : ""}

          <Badge badgeContent={3} color="error" className={apiContent && apiContent.autocomplete ? `${classes.mr12}` : `${classes.mlAuto} ${classes.mr12}`} >
            <AddAlert />
          </Badge>
          <UserMenu classes={classes} content={content.usermenu} />
        </Toolbar>
      </AppBar>
    </ThemeProvider >
  )
}

