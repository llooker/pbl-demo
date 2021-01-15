import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  AppBar, Toolbar, Badge, Avatar, IconButton
} from '@material-ui/core/';
import { AddAlert, ChevronLeft, Menu } from '@material-ui/icons';
import AppContext from '../../contexts/AppContext';
import { useStyles } from './styles.js';

import UserMenu from './UserMenu';
import { AutoComplete } from "@pbl-demo/components";



import Dashboard from '../../components/Demo/Dashboard/Dashboard'
import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined';

const InventoryOverviewContent = {
  "type": "custom filter",
  "label": "Inventory Overview",
  "menuCategory": "operations",
  "description": "Overview of your inventory",
  "icon": TableChartOutlinedIcon,
  "component": Dashboard,
  "lookerContent": [
    {
      "type": "dashboard",
      "lookerMethod": "embedDashboard",
      "id": "1",
      "isNext": false,
      "label": "Inventory Overview",
      "filters": [
        {
          "label": "Select Application ID",
          "filterName": "Application ID",
          "lookerMethod": "runInlineQuery"
        }
      ],
      "inlineQueries": [
        {
          "model": "vision",
          "view": "person",
          "fields": [
            "person.application_id"
          ],
          "query_timezone": "America/Los_Angeles"
        }
      ],
      "desiredFilterNames": [
        "person.application_id"
      ],
      "filterComponents": [
        "autocomplete"
      ]
    }
  ]
}

export default function TopBar(props) {
  const classes = useStyles();

  let { clientSession, setClientSession,
    drawerOpen, setDrawerOpen,
    sdk, corsApiCall
  } = useContext(AppContext)
  const { packageName } = clientSession;
  const [apiContent, setApiContent] = useState(undefined);


  useEffect(() => {
    performLookerApiCalls()
  }, [])

  const performLookerApiCalls = async () => {
    let lookerResponseData = await sdk.ok(sdk.run_inline_query({ result_format: InventoryOverviewContent.lookerContent[0].result_format || "json", body: InventoryOverviewContent.lookerContent[0].inlineQueries[0] }))
    console.log({ lookerResponseData })
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

        <AutoComplete lookerContent={InventoryOverviewContent.lookerContent}
          apiContent={apiContent}
          index={0}
          classes={classes}
          horizontalLayout={true} />

        <Badge badgeContent={3} color="error" className={`${classes.mr12} `} >
          <AddAlert />
        </Badge>
        <UserMenu />
      </Toolbar>
    </AppBar>
  )
}


