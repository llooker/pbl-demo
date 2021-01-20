import $ from 'jquery';
import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { Grid, Card } from '@material-ui/core'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import AppContext from '../../../contexts/AppContext';
import FilterBar from './FilterBar';
import EmbeddedDashboardContainer from './EmbeddedDashboardContainer';
import { Loader, CodeFlyout } from "@pbl-demo/components/Accessories";
import { useStyles, topBarBottomBarHeight } from '../styles.js';

const { validIdHelper } = require('../../../tools');

export default function Dashboard(props) {
  // console.log('Dashboard');
  const { clientSession, clientSession: { lookerUser }, sdk, corsApiCall, theme, isReady, selectedMenuItem } = useContext(AppContext)
  const { staticContent: { lookerContent }, staticContent: { type } } = props;
  const demoComponentType = type || 'code flyout';

  const [iFrameExists, setIFrame] = useState(0);
  const [apiContent, setApiContent] = useState(undefined);
  const [dashboardObj, setDashboardObj] = useState({});
  const [dashboardOptions, setDashboardOptions] = useState({});
  const [height, setHeight] = useState((window.innerHeight - topBarBottomBarHeight));
  const [tileToggleValue, setTileToggleValue] = useState('');
  const [visColorToggleValue, setVisColorToggleValue] = useState('#2d4266');
  const [lightThemeToggleValue, setLightThemeToggleValue] = useState(true);
  const [fontThemeSelectValue, setFontThemeSelectValue] = useState("arial");
  const [expansionPanelHeight, setExpansionPanelHeight] = useState(0);
  const [horizontalLayout, setHorizontalLayout] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);

  let dynamicVisConfigFilterItem = _.find(lookerContent[0].filters, { label: "Dynamic Vis Config" });
  const isThemeableDashboard = dynamicVisConfigFilterItem && Object.keys(dynamicVisConfigFilterItem).length ? true : false;
  const darkThemeBackgroundColor = theme.palette.fill.main;

  const classes = useStyles();

  //condtional theming for dark mode :D
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

  const handleTileToggle = (event, newValue) => {
    let dynamicTileFilterItem = _.find(lookerContent[0].filters, { label: "Dynamic Tiles" });

    if (dynamicTileFilterItem) {
      setTileToggleValue(newValue)
      const filteredLayout = _.filter(dashboardOptions.layouts[0].dashboard_layout_components, (row) => {
        return (dynamicTileFilterItem.tileLookUp[newValue].indexOf(dashboardOptions.elements[row.dashboard_element_id].title) > -1)
      })

      const newDashboardLayout = {
        ...dashboardOptions.layouts[0],
        dashboard_layout_components: filteredLayout
      }
      dashboardObj.setOptions({ "layouts": [newDashboardLayout] })

    }
  };

  const handleVisColorToggle = (event, newValue) => {
    let dynamicVisConfigFilterItem = _.find(lookerContent[0].filters, { label: "Dynamic Vis Config" });
    if (dynamicVisConfigFilterItem) {
      let newColorSeries = dynamicVisConfigFilterItem.colors[newValue]
      let newDashboardElements = { ...dashboardOptions.elements };

      Object.keys(newDashboardElements).map(key => {
        if (newDashboardElements[key].vis_config.series_colors) {
          Object.keys(newDashboardElements[key].vis_config.series_colors).map((innerKey, index) => {
            newDashboardElements[key].vis_config.series_colors[innerKey] = newColorSeries[index] || newColorSeries[0];
          })
        }
        if (newDashboardElements[key].vis_config.custom_color) {
          newDashboardElements[key].vis_config.custom_color = newColorSeries[newColorSeries.length - 2];
        }
        if (newDashboardElements[key].vis_config.map_value_colors) {
          newDashboardElements[key].vis_config.map_value_colors.map((item, index) => {
            newDashboardElements[key].vis_config.map_value_colors[index] = newColorSeries[index] || newColorSeries[0];
          })
        }
        // loss some fidelity here
        if (newDashboardElements[key].vis_config.series_cell_visualizations) {
          Object.keys(newDashboardElements[key].vis_config.series_cell_visualizations).map((innerKey, index) => {
            if (newDashboardElements[key].vis_config.series_cell_visualizations[innerKey].hasOwnProperty("palette")) {
              newDashboardElements[key].vis_config.series_cell_visualizations[innerKey]["palette"] = { ...dynamicVisConfigFilterItem.series_cell_visualizations[newValue] }
            }
          })
        }
        if (newDashboardElements[key].vis_config.header_font_color) {
          newDashboardElements[key].vis_config.header_font_color = newColorSeries[newColorSeries.length - 2];
        }
        if (isThemeableDashboard) {
          if (newDashboardElements[key].vis_config.map_tile_provider) {
            newDashboardElements[key].vis_config.map_tile_provider = lightThemeToggleValue ? "light" : "dark";
          }

        }
      })
      setVisColorToggleValue(newValue)
      dashboardObj.setOptions({ "elements": { ...newDashboardElements } })
    }
  };

  const handleThemeChange = (event, newValue) => {
    let themeName = '';
    if (typeof newValue === "boolean") {//handleModeToggle
      setLightThemeToggleValue(newValue)
      themeName = newValue ? `light_${fontThemeSelectValue}` : `dark_${fontThemeSelectValue}`
    } else { //handleFontToggle
      themeName = lightThemeToggleValue ? `light_${newValue}` : `dark_${newValue}`
      setFontThemeSelectValue(newValue)
    }

    corsApiCall(performLookerApiCalls, [lookerContent, themeName])
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
      setHorizontalLayout(false);
      setDrawerOpen(true);
    }
  }, [lookerUser, isReady, selectedMenuItem])

  useEffect(() => {
    if (Object.keys(dashboardOptions).length && Object.keys(dashboardObj).length
    ) {
      handleTileToggle(null, tileToggleValue ? tileToggleValue : "Inventory")
      handleVisColorToggle(null, visColorToggleValue ? visColorToggleValue : '#2d4266');
    }
  }, [dashboardOptions]);

  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - topBarBottomBarHeight)));
    setExpansionPanelHeight(horizontalLayout ? $('.MuiExpansionPanel-root:visible').innerHeight() || 0 : 0)
  })

  useEffect(() => {
    setHeight((window.innerHeight - topBarBottomBarHeight));
    setExpansionPanelHeight(horizontalLayout ? $('.MuiExpansionPanel-root:visible').innerHeight() || 0 : 0)
  }, [horizontalLayout])

  useEffect(() => {
    setApiContent(undefined);
  }, [])

  const performLookerApiCalls = function (lookerContent, dynamicTheme) {

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
        })
        .build()
        .connect()
        .then((dashboard) => {
          setIFrame(1)
          setDashboardObj(dashboard)
          let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
          LookerEmbedSDK.init(modifiedBaseUrl)
        })
        .catch((error) => {
          // console.error('Connection error', error)
        })

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

  const customFilterAction = (filterName, newFilterValue) => {
    if (Object.keys(dashboardObj).length) {
      dashboardObj.updateFilters({ [filterName]: newFilterValue })
      dashboardObj.run()
    }
  }

  return (
    <div className={`${classes.root} demoComponent`}
      style={{ height }}
    >
      <ThemeProvider theme={themeToUse}>
        <Card elevation={1} className={`${classes.padding30} ${classes.height100Percent}`}>
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
                  tileToggleValue={tileToggleValue}
                  handleTileToggle={handleTileToggle}
                  visColorToggleValue={visColorToggleValue}
                  handleVisColorToggle={handleVisColorToggle}
                  lightThemeToggleValue={lightThemeToggleValue}
                  fontThemeSelectValue={fontThemeSelectValue}
                  handleThemeChange={handleThemeChange}
                  horizontalLayout={horizontalLayout}
                  setHorizontalLayout={setHorizontalLayout}
                  drawerOpen={drawerOpen}
                  setDrawerOpen={setDrawerOpen}
                />
                :
                ''}


              <EmbeddedDashboardContainer
                classes={classes}
                lookerContent={lookerContent}
                type={demoComponentType}
                width={lookerContent[0].hasOwnProperty("filters") ? horizontalLayout ? 12 : drawerOpen ? 9 : 12 : 12}
              />

              <CodeFlyout {...props}
                classes={classes}
                lookerUser={lookerUser}
                height={height}
              />

            </Grid>
          </div>
        </Card>
      </ThemeProvider>
    </ div>
  )
}