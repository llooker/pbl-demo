import $ from 'jquery';
import _ from 'lodash'
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import { Grid, Card } from '@material-ui/core'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import EmbeddedDashboardContainer from './EmbeddedDashboardContainer';
import { Loader, CodeFlyout } from "@pbl-demo/components/Accessories";
import { useStyles, topBarBottomBarHeight, additionalHeightForFlyout, } from '../styles.js';
import queryString from 'query-string';
import { appContextMap, decodeHtml, validIdHelper } from '../../utils/tools';
import { handleTileToggle, handleVisColorToggle, handleThemeChange, runInlineQuery } from './helpers';
import { AdjacentContainer } from "./AdjacentContainer"
import { SimpleModal } from "@pbl-demo/components";


export const Dashboard = ({ staticContent }) => {
  // console.log('Dashboard');
  const { clientSession, clientSession: { lookerUser }, sdk, corsApiCall, theme, isReady, selectedMenuItem, drawerOpen } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);

  const { lookerContent, type } = staticContent;
  const demoComponentType = type || 'code flyout';
  const dynamicTopBarBottomBarHeight = process.env.REACT_APP_PACKAGE_NAME === "vision" ? 0 : topBarBottomBarHeight;

  const [iFrameExists, setIFrame] = useState(0);
  const [apiContent, setApiContent] = useState(undefined);
  const [dashboardObj, setDashboardObj] = useState({});
  const [dashboardOptions, setDashboardOptions] = useState({});
  const [height, setHeight] = useState((window.innerHeight - dynamicTopBarBottomBarHeight));
  const [lightThemeToggleValue, setLightThemeToggleValue] = useState(true);
  const [fontThemeSelectValue, setFontThemeSelectValue] = useState("arial");
  const [expansionPanelHeight, setExpansionPanelHeight] = useState(0);
  const [makeShiftDrawerOpen, setMakeShiftDrawerOpen] = useState(true);
  const [hiddenFilterValue, setHiddenFilterValue] = useState(null);
  const [renderModal, setRenderModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  let dynamicVisConfigFilterItem = lookerContent[0].adjacentContainer ? _.find(lookerContent[0].adjacentContainer.items, { label: "Dynamic Vis Config" }) : null;
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


    let helperResponse = await filterItem.method({
      newValue, filterItem, dashboardOptions,
      isThemeableDashboard, lightThemeToggleValue, fontThemeSelectValue,
      hiddenFilterValue
    })
    let { methodName, response } = helperResponse; //dynamic
    if (methodName === "handleTileToggle" || methodName === "handleVisColorToggle") {
      dashboardObj.setOptions(response);
    } else if (methodName === "handleThemeChange") {
      if (typeof newValue === "boolean") {
        setLightThemeToggleValue(newValue)
      } else {
        setFontThemeSelectValue(newValue)
      }
      corsApiCall(performLookerApiCalls, [lookerContent, response])
    } else if (methodName === "createCase") {
      corsApiCall(performLookerApiCalls, [lookerContent]) //doesn't refresh data, only dashboard
      return response
    } else if (methodName === "addCaseNotes") {
      corsApiCall(performLookerApiCalls, [lookerContent]) //doesn't refresh data, only dashboard
      setRenderModal(false)
    } else if (methodName === "changeCaseStatus") {
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
    window.addEventListener("resize", () => setHeight((window.innerHeight - dynamicTopBarBottomBarHeight)));
    setExpansionPanelHeight(0)
  })

  // needed to copy from home to make it work
  useEffect(() => {
    setApiContent(undefined);
    let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
    LookerEmbedSDK.init(modifiedBaseUrl, '/auth')
  }, []);


  const performLookerApiCalls = (lookerContent, dynamicTheme) => {
    // console.log("performLookerApiCalls");
    // console.log({ lookerContent })
    // console.log({ dynamicTheme })

    setIFrame(0)
    $(`.embedContainer.${validIdHelper(demoComponentType)}:visible`).html('')
    lookerContent.map(async lookerContentItem => {
      //dashboard creation
      let dashboardId = lookerContentItem.slug || lookerContentItem.id;
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
        .withParams({
          'schedule_modal': 'true',
          'always_filter': 'true'
        })
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
        .on('page:changed', (event) => {
          if (lookerContent[0].slug === "219Tk9NQ4sGSjGNsRSFKjG") {
            const absoluteUrl = new URL(event.page.absoluteUrl)
            let params = queryString.parse(absoluteUrl.search);

            let matchingKey = _.find(Object.keys(params), (o) => {
              return o.indexOf("case.case_id") > -1
            })

            if (matchingKey) {
              setHiddenFilterValue(params[matchingKey])
            } else {
              setHiddenFilterValue(null)
            }
          }
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
          // console.log({ error })
        });

      if (lookerContentItem.hasOwnProperty("adjacentContainer")) {
        let asyncApiEntries = lookerContentItem.adjacentContainer.items.map(async item => {
          if (item.hasOwnProperty("inlineQuery")) {
            return [item.apiKey, await runInlineQuery({ sdk, item, lookerUser })] //
          }
          return {}
        })
        let apiContentObj = Object.fromEntries(await Promise.all(asyncApiEntries));
        if (apiContentObj.hasOwnProperty("autocomplete")) {
          //api results for autocomplete component need to be specially formatted
          let autocompleteResults = apiContentObj.autocomplete
          let dropdownResults = [];
          let desiredProperty = Object.keys(apiContentObj.autocomplete[0])[0];

          for (let i = 0; i < autocompleteResults.length; i++) {
            dropdownResults.push({
              'label': autocompleteResults[i][desiredProperty],
              'trend': (autocompleteResults[i]['trend']) ? autocompleteResults[i]['trend'] : undefined,
              'count': (autocompleteResults[i]['count']) ? autocompleteResults[i]['count'] : undefined
            })
          }

          apiContentObj.autocomplete = dropdownResults

        }
        if (apiContentObj) setApiContent(apiContentObj || {})
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

  const handleRenderModal = ({ filterItem, status }) => {
    // console.log("handleRenderModal")
    // console.log({ filterItem })

    setModalInfo(filterItem.secondaryComponent)
    setRenderModal(status)
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



  return (
    <div className={`${classes.root} ${classes.positionRelative}`}
      style={{ height }}
    >
      <ThemeProvider theme={themeToUse}>
        <Card elevation={1}
          className={` ${classes.height100Percent} ${classes.padding5}`}
        >
          <Grid
            container
            spacing={3}
          >
            <Loader
              hide={iFrameExists}
              classes={classes}
              height={height} />

            {lookerContent[0].hasOwnProperty("adjacentContainer") ?

              <AdjacentContainer
                container={lookerContent[0].adjacentContainer}
                makeShiftDrawerOpen={makeShiftDrawerOpen}
                setMakeShiftDrawerOpen={setMakeShiftDrawerOpen}
                apiContent={apiContent}
                helperFunctionMapper={helperFunctionMapper}
                classes={classes}
                customFilterAction={customFilterAction}
                lightThemeToggleValue={lightThemeToggleValue}
                fontThemeSelectValue={fontThemeSelectValue}
                handleRenderModal={handleRenderModal}
                hiddenFilterValue={hiddenFilterValue}
              />
              : ""}

            {renderModal ? <SimpleModal setRenderModal={setRenderModal} modalInfo={modalInfo} helperFunctionMapper={helperFunctionMapper} /> : ""}

            <EmbeddedDashboardContainer
              classes={classes}
              lookerContent={lookerContent}
              type={demoComponentType}
            />

            <CodeFlyout
              classes={classes}
              lookerUser={lookerUser}
              height={height - expansionPanelHeight - additionalHeightForFlyout}
            />

          </Grid>
        </Card>
      </ThemeProvider >
    </ div >
  )
}