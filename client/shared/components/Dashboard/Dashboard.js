import $ from 'jquery';
import _ from 'lodash'
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import { Grid, Card } from '@material-ui/core'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import FilterBar from './FilterBar';
import EmbeddedDashboardContainer from './EmbeddedDashboardContainer';
import { Loader, CodeFlyout } from "@pbl-demo/components/Accessories";
import { useStyles, topBarBottomBarHeight, additionalHeightForFlyout } from '../styles.js';
import queryString from 'query-string';
import { appContextMap, validIdHelper } from '../../utils/tools';
import { handleTileToggle, handleVisColorToggle, handleThemeChange } from './helpers';


export const Dashboard = (props) => {
  console.log('Dashboard');
  const { clientSession, clientSession: { lookerUser }, sdk, corsApiCall, theme, isReady, selectedMenuItem } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);

  const { staticContent: { lookerContent }, staticContent: { type } } = props;
  const demoComponentType = type || 'code flyout';

  const [iFrameExists, setIFrame] = useState(0);
  const [apiContent, setApiContent] = useState(undefined);
  const [dashboardObj, setDashboardObj] = useState({});
  const [dashboardOptions, setDashboardOptions] = useState({});
  const [height, setHeight] = useState((window.innerHeight - topBarBottomBarHeight));
  const [lightThemeToggleValue, setLightThemeToggleValue] = useState(true);
  const [fontThemeSelectValue, setFontThemeSelectValue] = useState("arial");
  const [expansionPanelHeight, setExpansionPanelHeight] = useState(0);
  const [makeShiftDrawerOpen, setMakeShiftDrawerOpen] = useState(true);
  const [hiddenFilterValue, setHiddenFilterValue] = useState(null);

  let dynamicVisConfigFilterItem = _.find(lookerContent[0].filters, { label: "Dynamic Vis Config" });
  const isThemeableDashboard = dynamicVisConfigFilterItem && Object.keys(dynamicVisConfigFilterItem).length ? true : false;
  const darkThemeBackgroundColor = theme.palette.fill.main;

  const classes = useStyles();
  const location = useLocation();
  let history = useHistory();

  //conditional theming for dark mode :D
  let paletteToUse = !lightThemeToggleValue && isThemeableDashboard ?
    {
      palette: {
        type: 'dark',
        background: { paper: darkThemeBackgroundColor, default: darkThemeBackgroundColor },
      }
    }
    :
    { palette: { ...theme.palette } }

  const themeToUse = React.useMemo(
    () =>
      createMuiTheme(
        paletteToUse
      ),
    [lightThemeToggleValue, lookerContent],
  );

  const helperFunctionMapper = async (event, newValue, filterItem) => {
    // console.log("helperFunctionMapper")
    // console.log({ newValue })
    // console.log({ filterItem })
    // console.log({ hiddenFilterValue })
    let helperResponse = await filterItem.method({
      newValue, filterItem, dashboardOptions,
      isThemeableDashboard, lightThemeToggleValue, fontThemeSelectValue,
      hiddenFilterValue
    })
    let { methodName, response } = helperResponse; //dynamic
    if (methodName === "handleTileToggle" || methodName === "handleVisColorToggle") {
      dashboardObj.setOptions(response);
    }
    else if (methodName === "handleThemeChange") {
      if (typeof newValue === "boolean") {
        setLightThemeToggleValue(newValue)
      } else setFontThemeSelectValue(newValue)
      corsApiCall(performLookerApiCalls, [lookerContent, response])
    }
    else if (methodName === "createCase") {
      console.log("createCase")
      corsApiCall(performLookerApiCalls, [lookerContent]) //doesn't refresh data, only dashboard
      return response
    }
  }

  useEffect(() => {
    console.log("useEffect outer");
    console.log({ lookerUser });
    console.log({ isReady });
    if (isReady) {
      console.log("useEffect inner")
      let themeName = lightThemeToggleValue ? 'light' : 'dark';
      themeName += `_${fontThemeSelectValue}`;
      corsApiCall(performLookerApiCalls, [[...lookerContent], themeName])
      setApiContent(undefined);
      setMakeShiftDrawerOpen(true);
    }
  }, [lookerUser, isReady, selectedMenuItem])

  useEffect(() => {
    if (Object.keys(dashboardOptions).length && Object.keys(dashboardObj).length
    ) {
      let tileToggleFilterItem = _.find(lookerContent[0].filters, { label: "Dynamic Tiles" })
      let visColorFilterItem = _.find(lookerContent[0].filters, { label: "Dynamic Vis Config" })

      let tileResponse, visColorResponse
      if (tileToggleFilterItem) {
        tileResponse = handleTileToggle({
          newValue: tileToggleFilterItem.options[0],
          filterItem: tileToggleFilterItem,
          dashboardOptions: dashboardOptions
        });
      }

      if (visColorFilterItem) {
        visColorResponse = handleVisColorToggle({
          newValue: visColorFilterItem.options[0],
          filterItem: visColorFilterItem,
          dashboardOptions: dashboardOptions,
          isThemeableDashboard: isThemeableDashboard,
          lightThemeToggleValue: lightThemeToggleValue
        });
      }

      dashboardObj.setOptions({
        ...tileResponse,
        ...visColorResponse
      })
    }
  }, [dashboardOptions]);

  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - topBarBottomBarHeight)));
    setExpansionPanelHeight(0)
  })

  // needed to copy from home to make it work
  useEffect(() => {
    setApiContent(undefined);
    let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
    LookerEmbedSDK.init(modifiedBaseUrl, '/auth')
  }, []);


  const performLookerApiCalls = function (lookerContent, dynamicTheme) {
    // console.log("performLookerApiCalls");
    // console.log({ lookerContent })
    // console.log({ dynamicTheme })

    setIFrame(0)
    $(`.embedContainer.${validIdHelper(demoComponentType)}:visible`).html('')
    lookerContent.map(async lookerContentItem => {
      //dashboard creation
      let dashboardId = lookerContentItem.id;
      let themeToUse = dynamicTheme && isThemeableDashboard ?
        dynamicTheme :
        lookerContentItem.theme ?
          lookerContentItem.theme :
          'atom_fashion';

      LookerEmbedSDK.createDashboardWithId(dashboardId)
        .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${dashboardId}`))
        .withClassName('iframe')
        .withNext()
        .withTheme(themeToUse)
        .withParams({ 'schedule_modal': 'true' })
        .on('dashboard:loaded', (event) => {
          setDashboardOptions(event.dashboard.options)
          let keyName = Object.keys(event.dashboard.dashboard_filters)[0];
          let keyValue = event.dashboard.dashboard_filters[keyName];
          setHiddenFilterValue(keyValue)
        })
        .on('drillmenu:click', drillMenuClick)
        .on('dashboard:filters:changed', (event) => {
          let keyName = Object.keys(event.dashboard.dashboard_filters)[0];
          let keyValue = event.dashboard.dashboard_filters[keyName];
          setHiddenFilterValue(keyValue)
        })
        .build()
        .connect()
        .then((dashboard) => {
          setIFrame(1)
          setDashboardObj(dashboard)
          let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
          // more robust regex solution
          // let modifiedBaseUrl = clientSession.lookerBaseUrl.replace(/:443$/, "")
          LookerEmbedSDK.init(modifiedBaseUrl)
        }).catch(error => {
          console.log({ error })
        });


      //api calls
      if (lookerContentItem.hasOwnProperty('filters') //&& !apiContent
      ) {
        // setApiContent(undefined)
        // get inline query from usecase file & set user attribute dynamically
        // iterating over filters
        let apiContentObj = {}
        lookerContentItem.filters.map(async (filterItem, index) => {
          if (filterItem.inlineQuery) {
            let jsonQuery = filterItem.inlineQuery
            jsonQuery.filters = {
              ...jsonQuery.filters,
              [filterItem.desiredFilterName]: lookerUser.user_attributes.brand
            };
            let lookerResponseData = await sdk.ok(sdk.run_inline_query({ result_format: filterItem.resultFormat || 'json', body: jsonQuery }));
            let queryResultsForDropdown = [];
            let desiredProperty = Object.keys(lookerResponseData[0])[0];

            for (let i = 0; i < lookerResponseData.length; i++) {
              queryResultsForDropdown.push({
                'label': lookerResponseData[i][desiredProperty],
                'trend': (lookerResponseData[i]['trend']) ? lookerResponseData[i]['trend'] : undefined
              })
            }
            apiContentObj[filterItem.component] = queryResultsForDropdown
          }
          setApiContent(apiContentObj)
        })
      }
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const customFilterAction = useCallback((filterName, newFilterValue) => {
    // console.log("customFilterAction")
    // console.log({ filterName })
    // console.log({ newFilterValue })
    if (Object.keys(dashboardObj).length) {
      dashboardObj.updateFilters({ [filterName]: newFilterValue })
      dashboardObj.run()
    }
  })

  const drillMenuClick = (event) => {
    // console.log("drillMenuClick")
    // console.log({ event })
    if (_.includes(_.lowerCase(event.label), "w2")) {
      history.push({
        pathname: 'eligibilitydocs',
        search: (`pdf_url=${event.url}`)
      })
      return { cancel: true }
    } else if (_.includes(_.lowerCase(event.label), "1099")) {
      history.push({
        pathname: 'eligibilitydocs',
        search: (`pdf_url=${event.url}`)
      })
      return { cancel: true }
    } else if (_.includes(_.lowerCase(event.label), "application")) {
      history.push({
        pathname: 'application',
        search: (`Application ID=${event.url}`)
      })
      return { cancel: true }
    } else if (_.includes(_.lowerCase(event.label), "beneficiary")) {
      history.push({
        pathname: 'beneficiary',
        search: (`Person ID=${event.url}`)
      })
      return { cancel: true }
    }
  }

  useEffect(() => {
    // console.log("useEffect")
    let params = queryString.parse(location.search);
    if (lookerContent[0].filterName) {
      let paramMatchesFilterName = params[lookerContent[0].filterName] > 0 ? true : false;
      if (paramMatchesFilterName)
        customFilterAction(lookerContent[0].filterName, params[lookerContent[0].filterName])

    }

  }, [customFilterAction, location.search, lookerContent])

  // localStorage.debug = 'looker:chatty:*'


  return (
    <div className={`${classes.root} ${classes.positionRelative}`}
      style={{ height }}
    >
      <ThemeProvider theme={themeToUse}>
        <Card elevation={1} className={lookerContent[0].hasOwnProperty("filters") ? `${classes.padding15} ${classes.height100Percent}` : `${classes.paddingTB15} ${classes.height100Percent}`}>
          <div
            className={`${classes.root} ${classes.height100Percent}`}
          >
            <Grid
              container
              spacing={3}
            >
              <Loader
                hide={iFrameExists}
                classes={classes}
                height={height - expansionPanelHeight} />

              {lookerContent[0].hasOwnProperty("filters") ?

                < FilterBar {...props}
                  classes={classes}
                  apiContent={apiContent}
                  customFilterAction={customFilterAction}
                  lightThemeToggleValue={lightThemeToggleValue}
                  fontThemeSelectValue={fontThemeSelectValue}
                  makeShiftDrawerOpen={makeShiftDrawerOpen}
                  setMakeShiftDrawerOpen={setMakeShiftDrawerOpen}
                  helperFunctionMapper={helperFunctionMapper}
                />
                :
                ''}

              <EmbeddedDashboardContainer
                classes={classes}
                lookerContent={lookerContent}
                type={demoComponentType}
              />

              <CodeFlyout {...props}
                classes={classes}
                lookerUser={lookerUser}
                height={height - expansionPanelHeight - additionalHeightForFlyout}
              />

            </Grid>
          </div>
        </Card>
      </ThemeProvider >
    </ div >
  )
}