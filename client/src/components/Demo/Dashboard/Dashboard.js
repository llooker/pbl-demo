import $ from 'jquery';
import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import {
  Typography, Box, Grid, CircularProgress, Card, TextField,
  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Slider, FormControl, InputLabel, Select, MenuItem, Switch
} from '@material-ui/core'
import { Autocomplete, ToggleButton, ToggleButtonGroup, Skeleton } from '@material-ui/lab'
import {
  ExpandMore, FilterList, SentimentDissatisfied, SentimentSatisfied, SentimentVerySatisfied,
} from '@material-ui/icons';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { LookerEmbedSDK } from '@looker/embed-sdk'
import CodeFlyout from '../CodeFlyout';
import rawSampleCode from '!!raw-loader!./Dashboard.js'; // eslint-disable-line import/no-webpack-loader-syntax
import useStyles from './styles.js';
import { ApiHighlight, EmbedHighlight, EmbedMethodHighlight } from '../../Highlights/Highlight'; //ooops
import { NumberToColoredPercent } from '../../Accessories/NumberToColoredPercent';
import AppContext from '../../../contexts/AppContext';
import Usa from "@svg-maps/usa";
import { CheckboxSVGMap } from "./CheckboxSvgMapRegion";
const { validIdHelper } = require('../../../tools');

export default function Dashboard(props) {

  console.log('Dashboard');

  const { staticContent: { lookerContent }, staticContent: { type } } = props;

  const { clientSession, codeShow, sdk, corsApiCall, atomTheme, selectedMenuItem } = useContext(AppContext)
  const { lookerUser, lookerHost } = clientSession;

  console.log('selectedMenuItem', selectedMenuItem)

  const demoComponentType = type || 'code flyout';
  const topBarBottomBarHeight = 112;

  const [value, setValue] = useState(0);
  const [iFrameExists, setIFrame] = useState(0);
  const [apiContent, setApiContent] = useState(undefined);
  const [dashboardObj, setDashboardObj] = useState({});
  // const [clientSideCode, setClientSideCode] = useState('');
  const [dashboardOptions, setDashboardOptions] = useState({});
  const [regionValue, setRegionValue] = useState('Pacific,South,Mountain,Midwest,Northeast');
  const [height, setHeight] = useState((window.innerHeight - topBarBottomBarHeight));
  const [tileToggleValue, setTileToggleValue] = useState('');
  const [visColorToggleValue, setVisColorToggleValue] = useState('#2d4266');
  const [lightThemeToggleValue, setLightThemeToggleValue] = useState(true);
  const [fontThemeSelectValue, setFontThemeSelectValue] = useState("arial");
  const [expansionPanelHeight, setExpansionPanelHeight] = useState(0);

  const isThemeableDashboard = validIdHelper(`${demoComponentType}${lookerContent[0].id}`) === 'customfilter1';
  const darkThemeBackgroundColor = "#343D4E";

  console.log('isThemeableDashboard', isThemeableDashboard)

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
    { palette: { ...atomTheme.palette } }
  console.log('paletteToUse', paletteToUse)

  const theme = React.useMemo(
    () =>
      createMuiTheme(
        paletteToUse
      ),
    [lightThemeToggleValue, lookerContent],
  );


  const handleTileToggle = (event, newValue) => {
    setTileToggleValue(newValue)
    const filteredLayout = _.filter(dashboardOptions.layouts[0].dashboard_layout_components, (row) => {
      return (lookerContent[0].dynamicFieldLookUp[newValue].indexOf(dashboardOptions.elements[row.dashboard_element_id].title) > -1)
    })

    const newDashboardLayout = {
      ...dashboardOptions.layouts[0],
      dashboard_layout_components: filteredLayout
    }
    dashboardObj.setOptions({ "layouts": [newDashboardLayout] })
  };

  const handleVisColorToggle = (event, newValue) => {
    let newColorSeries = lookerContent[0].dynamicVisConfig.colors[newValue];
    let newDashboardElements = { ...dashboardOptions.elements };
    Object.keys(newDashboardElements).map(key => {
      if (newDashboardElements[key].vis_config.series_colors) {
        Object.keys(newDashboardElements[key].vis_config.series_colors).map((innerKey, index) => {
          newDashboardElements[key].vis_config.series_colors[innerKey] = newColorSeries[index] || newColorSeries[0];
        })
      }

      if (newDashboardElements[key].vis_config.custom_color) {
        newDashboardElements[key].vis_config.custom_color = newColorSeries[0]
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
            newDashboardElements[key].vis_config.series_cell_visualizations[innerKey]["palette"] = { ...lookerContent[0].dynamicVisConfig.series_cell_visualizations[newValue] }
          }
        })
      }


    })
    setVisColorToggleValue(newValue)
    dashboardObj.setOptions({ "elements": { ...newDashboardElements } })
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
    console.log("useEffect, [lookerContent, lookerUser]")
    let themeName = lightThemeToggleValue ? 'light' : 'dark';
    themeName += `_${fontThemeSelectValue}`;
    corsApiCall(performLookerApiCalls, [[...lookerContent], themeName])
    // setClientSideCode(rawSampleCode)
  }, [lookerContent, lookerUser]);


  useEffect(() => {
    if (Object.keys(dashboardOptions).length && Object.keys(dashboardObj).length && lookerContent[0].dynamicFieldLookUp) {
      handleTileToggle(null, tileToggleValue ? tileToggleValue : Object.keys(lookerContent[0].dynamicFieldLookUp)[0])
      handleVisColorToggle(null, visColorToggleValue ? visColorToggleValue : '#2d4266')
    }
  }, [dashboardOptions]);

  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - topBarBottomBarHeight)));
    setExpansionPanelHeight($('.MuiExpansionPanel-root:visible').innerHeight() || 0)
  })

  //componentDidMount
  useEffect(() => {
    setApiContent(undefined);
  }, [])


  const performLookerApiCalls = function (lookerContent, dynamicTheme) {
    console.log('performLookerApiCalls')
    console.log({ lookerContent })
    console.log({ dynamicTheme })

    setIFrame(0)
    $(`.embedContainer.${validIdHelper(demoComponentType)}:visible`).html('')
    lookerContent.map(async lookerContent => {
      //dashboard creation
      let dashboardId = lookerContent.id;
      let themeToUse = dynamicTheme && isThemeableDashboard ?
        dynamicTheme :
        lookerContent.theme ?
          lookerContent.theme :
          'atom_fashion';
      console.log('themeToUse', themeToUse)

      LookerEmbedSDK.createDashboardWithId(dashboardId) //dashboardSlug
        .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${dashboardId}`))
        .withClassName('iframe')
        .withNext()
        // .withNext(lookerContent.isNext || false) //how can I make this dynamic based on prop??
        .withTheme(themeToUse)
        .withParams({ 'schedule_modal': 'true' })
        .on('page:property:change', (event) => {
          // console.log('page property is changing!!!!')
          changeHeight(event)
        }) // dashboards-next
        .on('dashboard:loaded', (event) => {
          setDashboardOptions(event.dashboard.options)
        })
        // .on('drillmenu:click', (event) => {
        //   drillMenuClick(event)
        // })
        .build()
        .connect()
        .then((dashboard) => {
          setIFrame(1)
          setDashboardObj(dashboard)
          LookerEmbedSDK.init(`https://${lookerHost}.looker.com`);

        })
        .catch((error) => {
          // console.error('Connection error', error)
        })
      //additional api calls
      //only want to perform when there's not apiContent
      if (lookerContent.hasOwnProperty('filters') //&& !apiContent
      ) {
        console.log('are we inside this ifff????')
        // setApiContent(undefined)
        //get inline query from usecase file & set user attribute dynamically
        //iterating over filters
        let orderedArrayForApiContent = []
        lookerContent.filters.map(async (item, index) => {
          let jsonQuery = lookerContent.inlineQueries[index];
          jsonQuery.filters = {
            ...jsonQuery.filters,
            [item.desiredFilterName]: lookerUser.user_attributes.brand
          };

          let lookerResponseData = await sdk.ok(sdk.run_inline_query({ result_format: lookerContent.result_format || 'json', body: jsonQuery }));
          let queryResultsForDropdown = [];
          let desiredProperty = Object.keys(lookerResponseData[0])[0];

          for (let i = 0; i < lookerResponseData.length; i++) {
            queryResultsForDropdown.push({
              'label': lookerResponseData[i][desiredProperty],
              'trend': (lookerResponseData[i]['trend']) ? lookerResponseData[i]['trend'] : undefined
            })
          }

          orderedArrayForApiContent[index] = queryResultsForDropdown
          setApiContent([...orderedArrayForApiContent])
        })
      } else console.log('elllse')

    })
  }

  const customFilterAction = (dashboardId, filterName, newFilterValue) => {
    if (Object.keys(dashboardObj).length) {
      dashboardObj.updateFilters({ [filterName]: newFilterValue })
      dashboardObj.run()
    }
  }

  // const drillMenuClick = (event) => {
  //   const basicLookerUser = lookerUser.user_attributes.permission_level === 'basic' ? true : false;
  //   if (basicLookerUser) {
  //     togglePayWallModal()
  //     return { cancel: (basicLookerUser) ? true : false }
  //   }
  // }

  const changeHeight = (event) => {
    // console.log('changeHeight')
    // console.log('event', event)
  }


  console.log({ theme })

  return (
    <div className={`${classes.root} demoComponent`}
      style={{ height }}
    >
      <ThemeProvider theme={theme}>
        <Card elevation={1} className={`${classes.padding30} ${classes.height100Percent}`}>
          <Grid container>
            <div
              className={`${classes.root}`}
            >
              {lookerContent[0].hasOwnProperty("filters") &&
                apiContent &&
                apiContent.length === lookerContent[0].filters.length ?
                <Grid item
                  sm={12}
                  key={validIdHelper(`${demoComponentType}-FilterBar-${lookerContent[0].id}`)}>
                  <FilterBar {...props}
                    classes={classes}
                    apiContent={apiContent}
                    customFilterAction={customFilterAction}
                    regionValue={regionValue}
                    setRegionValue={setRegionValue}
                    tileToggleValue={tileToggleValue}
                    handleTileToggle={handleTileToggle}
                    visColorToggleValue={visColorToggleValue}
                    handleVisColorToggle={handleVisColorToggle}
                    lightThemeToggleValue={lightThemeToggleValue}
                    fontThemeSelectValue={fontThemeSelectValue}
                    handleThemeChange={handleThemeChange}
                    isThemeableDashboard={isThemeableDashboard}
                  />
                </Grid> :
                lookerContent[0].hasOwnProperty("filters") ?
                  <Skeleton variant="rect" animation="wave" className={classes.skeleton} /> :
                  ''}
              {
                iFrameExists
                  ? ''
                  :
                  <Grid item sm={12} style={{ height: height - 30 - expansionPanelHeight }}>
                    <Card className={`${classes.card} ${classes.flexCentered}`}
                      elevation={0}
                      mt={2}
                      style={{ height: height - 30 - expansionPanelHeight }}>
                      <CircularProgress className={classes.circularProgress} />
                    </Card>
                  </Grid>
              }
              <Box
                className={iFrameExists ? ` ` : `${classes.hidden} `}
                style={{ height: height - 30 - expansionPanelHeight }}>
                <Grid container
                  spacing={3}
                  className={`${classes.noContainerScroll}`}>
                  {codeShow ?
                    <Grid item sm={6}
                      className={`${classes.positionFixedTopRight}`}
                    >
                      <CodeFlyout {...props}
                        classes={classes}
                        lookerUser={lookerUser}
                        height={height}
                      />
                    </Grid>
                    : ''}
                  <Grid item sm={12}>
                    <Box className={`${classes.w100} ${classes.padding10}`} mt={lookerContent[0].filter || lookerContent[0].dynamicFieldLookUp ? 2 : 0}>
                      <EmbedHighlight classes={classes}>
                        <div
                          className={`embedContainer ${validIdHelper(demoComponentType)}`}
                          id={validIdHelper(`embedContainer-${demoComponentType}-${lookerContent[0].id}`)}
                          key={validIdHelper(`embedContainer-${demoComponentType}-${lookerContent[0].id}`)}
                        >
                        </div>
                      </EmbedHighlight>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </div>
          </Grid>
        </Card>
      </ThemeProvider>
    </ div>
  )
}


function FilterBar(props) {
  // console.log('FilterBar')
  const { staticContent, staticContent: { lookerContent }, staticContent: { type }, classes,
    apiContent, customFilterAction, regionValue, setRegionValue, tileToggleValue, handleTileToggle, //changeTheme,
    visColorToggleValue, handleVisColorToggle, lightThemeToggleValue, fontThemeSelectValue, handleThemeChange, isThemeableDashboard
  } = props;

  const [expanded, setExpanded] = useState(true);
  const [sliderValue, setSliderValue] = React.useState([]);
  const [lifetimeRevenueTierValue, setLifetimeRevenueTierValue] = useState('0-24');
  // const [speedDialOpen, setSpeedDialOpen] = React.useState(false);

  const handleExpansionPanel = (event, newValue) => {
    setExpanded(expanded ? false : true);
  };

  const customUsa = {
    ...Usa,
    label: "Custom map label",
    locations: Usa.locations.map(location => {
      // Modify each location
      switch (location.name) {
        //9
        case "Connecticut":
        case "Maine":
        case "Massachusetts":
        case "New Hampshire":
        case "Rhode Island":
        case "Vermont":
        case "New Jersey":
        case "New York":
        case "Pennsylvania":
        case "Delaware":
          return { ...location, region: "Northeast" }
        //12
        case "Illinois":
        case "Indiana":
        case "Michigan":
        case "Ohio":
        case "Wisconsin":
        case "Iowa":
        case "Kansas":
        case "Minnesota":
        case "Missouri":
        case "Nebraska":
        case "North Dakota":
        case "South Dakota":
          return { ...location, region: "Midwest" }
        //16
        case "Florida":
        case "Georgia":
        case "Maryland":
        case "North Carolina":
        case "South Carolina":
        case "Virginia":
        case "District of Columbia":
        case "Washington, DC":
        case "West Virginia":
        case "Alabama":
        case "Kentucky":
        case "Mississippi":
        case "Tennessee":
        case "Arkansas":
        case "Louisiana":
        case "Oklahoma":
        case "Texas":
          return { ...location, region: "South" }
        //8
        case "Arizona":
        case "Colorado":
        case "Idaho":
        case "Montana":
        case "Nevada":
        case "New Mexico":
        case "Utah":
        case "Wyoming":
          return { ...location, region: "Mountain" }
        //5
        case "Alaska":
        case "California":
        case "Hawaii":
        case "Oregon":
        case "Washington":
          return { ...location, region: "Pacific" }
        // default:
        //   return location
      }
    })
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const lifetimeRevenueTierMap = {
    "0 to 99": "low",
    "100 to 499": "medium",
    "500 or Above": "high",
  }
  const lifetimeRevenueTierIconMap = {
    "0 to 99": SentimentDissatisfied,
    "100 to 499": SentimentSatisfied,
    "500 or Above": SentimentVerySatisfied,
  }

  return (

    <ExpansionPanel
      expanded={expanded}
      onChange={handleExpansionPanel}
      // className={classes.w100}
      className={`${classes.w100} MuiExpansionPanel-root`}
      elevation={0}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <FilterList /><Typography className={`${classes.heading} ${classes.ml12}`}>Filter:</Typography>

      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid
          container spacing={3}>
          {
            lookerContent[0].filters || lookerContent[0].dynamicFieldLookUp ?
              <>
                {apiContent.map((item, index) => {
                  return (
                    lookerContent[0].filterComponents[index] === 'autocomplete' ?
                      <Grid item sm={3}>

                        <ApiHighlight classes={classes}
                          key={validIdHelper(`dashEmbed-${type}${lookerContent.id}-${index}`)} >

                          <Typography
                          >Filter By Product:</Typography>
                          <Autocomplete
                            id={`combo-box-dashboard-${lookerContent.id}`}
                            options={Array.isArray(apiContent[index]) ?
                              apiContent[index] :
                              []}
                            renderOption={(option) => (
                              <Grid container justify="space-between">
                                <Grid item >
                                  {option.label}
                                </Grid>
                                {option.trend && <Grid item>
                                  <NumberToColoredPercent
                                    val={option.trend}
                                    positive_good={true}
                                    abs_val={Math.abs(option.trend)}
                                  />
                                </Grid>}
                              </Grid>
                            )}
                            getOptionLabel={(option) => option.label}
                            onChange={(event, newValue) => {
                              customFilterAction(lookerContent[0].id,
                                lookerContent[0].filters[index].filterName,
                                (newValue) ? newValue.label : '')
                            }}
                            renderInput={(params) => <TextField {...params}
                              label={lookerContent[0].filters[index].filterName}
                              variant="outlined"
                            />}
                            loadingText="Loading..."
                          />
                        </ApiHighlight>
                      </Grid>
                      : lookerContent[0].filterComponents[index] === 'mapfilter' ?
                        <>
                          <Grid item sm={4} >
                            <EmbedMethodHighlight classes={classes}
                              key={validIdHelper(`dashEmbed-${type}${lookerContent.id}-${index}`)} >
                              <Typography className={`${classes.heading} ${classes.ml12}  ${classes.verticalAlignTop}`}
                              >Region(s): <b>{regionValue ? regionValue : "Outside US"}</b></Typography>

                              <CheckboxSVGMap map={customUsa}
                                onChange={(locations) => {

                                  let allUniqueRegionsFromSelectedLocations = [];
                                  for (let j = 0; j < locations.length; j++) {
                                    if (allUniqueRegionsFromSelectedLocations.indexOf(locations[j].region) == -1) {
                                      allUniqueRegionsFromSelectedLocations.push(locations[j].region)
                                    }
                                  }
                                  let allUniqueRegionsFromSelectedLocationsCommaSep = allUniqueRegionsFromSelectedLocations.join(",")
                                  setRegionValue(allUniqueRegionsFromSelectedLocationsCommaSep)
                                  customFilterAction(lookerContent[0].id,
                                    lookerContent[0].filters[index].filterName,
                                    (regionValue) ? regionValue : '')
                                }}
                              />
                            </EmbedMethodHighlight>
                          </Grid>
                        </>
                        : lookerContent[0].filterComponents[index] === "rangeslider"
                          ?

                          <Grid container item sm={4} >
                            <Grid item sm={12}>
                              <EmbedMethodHighlight classes={classes}
                                key={validIdHelper(`dashEmbed-${type}${lookerContent.id}-${index}`)} >
                                <Typography className={`${classes.heading} ${classes.ml12}  ${classes.verticalAlignTop}`}
                                >Age Range:</Typography>
                                <Slider
                                  value={sliderValue.length ? sliderValue : Array.isArray(apiContent[index]) ? [apiContent[index][0].label, apiContent[index][apiContent[index].length - 1].label] : []}
                                  onChange={handleSliderChange}
                                  onChange={(event, newValue) => {
                                    setSliderValue(newValue);
                                  }}
                                  valueLabelDisplay="auto"
                                  aria-labelledby="range-slider"
                                  onChangeCommitted={(event, newValue) => {
                                    customFilterAction(lookerContent[0].id,
                                      lookerContent[0].filters[index].filterName,
                                      (newValue) ? `[${newValue}]` : '[]')
                                  }}
                                  min={Array.isArray(apiContent[index]) ? apiContent[index][0].label : ''}
                                  max={Array.isArray(apiContent[index]) ? apiContent[index][apiContent[index].length - 1].label : ''}
                                  name="Age Range"
                                  marks={Array.isArray(apiContent[index]) ? [{ value: apiContent[index][0].label, label: apiContent[index][0].label }, { value: apiContent[index][apiContent[index].length - 1].label, label: apiContent[index][apiContent[index].length - 1].label }] : ''}
                                  disabled={Array.isArray(apiContent[index]) ? false : true}
                                />
                              </EmbedMethodHighlight>
                            </Grid>
                            <Grid item sm={12}>
                              <EmbedMethodHighlight classes={classes}
                                key={validIdHelper(`dashEmbed-${type}${lookerContent.id}-${index}`)} >
                                <Typography className={`${classes.heading} ${classes.ml12}  ${classes.verticalAlignTop}`}
                                >Lifetime Revenue Tier:</Typography>
                                <ToggleButtonGroup
                                  value={lifetimeRevenueTierValue}
                                  exclusive //for now
                                  onChange={(event, newValue) => {
                                    setLifetimeRevenueTierValue(newValue)
                                    customFilterAction(lookerContent[0].id,
                                      lookerContent[0].filters[index + 1].filterName,
                                      (newValue) ? newValue : '')
                                  }}
                                  aria-label="ageTier"
                                  className={classes.w100}>
                                  >
                                {apiContent[index + 1].map((ageTier, index) => {
                                    if (ageTier.label !== "Undefined") {
                                      const Icon = lifetimeRevenueTierIconMap[ageTier.label];
                                      return (
                                        <ToggleButton
                                          key={validIdHelper(`${type}-FilterBar-ToggleButton-${lookerContent[0].id}-${index}`)}
                                          value={ageTier.label}
                                          aria-label={ageTier.label}
                                          className={classes.w33}>
                                          <Icon className={classes.mr12} />
                                          {_.capitalize(lifetimeRevenueTierMap[ageTier.label]) || ageTier.label}
                                        </ToggleButton>
                                      )
                                    }
                                  })}
                                </ToggleButtonGroup>

                              </EmbedMethodHighlight>
                            </Grid>
                          </Grid>
                          :
                          '')
                })}
                {lookerContent[0].dynamicFieldLookUp ?
                  <>
                    <Grid item sm={3}>
                      <EmbedMethodHighlight classes={classes} >
                        <Typography
                        >Dynamic Tiles:</Typography>
                        <ToggleButtonGroup
                          value={tileToggleValue}
                          exclusive
                          onChange={handleTileToggle}
                          aria-label="text alignment"
                        >
                          {Object.keys(lookerContent[0].dynamicFieldLookUp).map(key => {
                            return (
                              <ToggleButton
                                key={validIdHelper(`dynamicDashTileToggle-${key}`)}
                                value={key} aria-label="left aligned">
                                {key}
                              </ToggleButton>
                            )
                          })}
                        </ToggleButtonGroup>
                      </EmbedMethodHighlight>
                    </Grid>
                  </>
                  : ''
                }
                {lookerContent[0].dynamicVisConfig ?
                  <>
                    <Grid item sm={2}>
                      <EmbedMethodHighlight classes={classes} >
                        <Typography
                        >Dynamic Vis Color:</Typography>
                        <ToggleButtonGroup
                          value={visColorToggleValue}
                          exclusive
                          onChange={handleVisColorToggle}
                          aria-label="text alignment"
                        >
                          {Object.keys(lookerContent[0].dynamicVisConfig.colors).map(key => {
                            return (
                              <ToggleButton
                                key={validIdHelper(`dynamicDashVisConfigToggle-${key}`)}
                                value={key} aria-label="left aligned">
                                <span className={`${classes.dot}`} style={{
                                  backgroundColor: (lookerContent[0].dynamicVisConfig.colors[key][lookerContent[0].dynamicVisConfig.colors[key].length - 1]
                                    || key)
                                }}></span>
                              </ToggleButton>
                            )
                          })}
                        </ToggleButtonGroup>

                      </EmbedMethodHighlight>
                    </Grid>
                  </>
                  : ''
                }
                {lookerContent[0].dynamicThemeMode ?
                  <>
                    <Grid item sm={1}>
                      <EmbedHighlight classes={classes} >
                        <Typography
                        >{lightThemeToggleValue ? "Light mode" : "Dark mode"}</Typography>

                        <Switch
                          checked={!lightThemeToggleValue}
                          onChange={() => handleThemeChange(null, !lightThemeToggleValue)}
                          color="primary"
                          name="light theme toggle"
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                        />

                      </EmbedHighlight>
                    </Grid>
                  </>
                  : ''
                }
                {lookerContent[0].dynamicThemeFont ?
                  <>
                    <Grid item sm={2}>
                      <EmbedHighlight classes={classes} >

                        <FormControl className={classes.formControl}>
                          <InputLabel id="demo-simple-select-label"
                          >Change font</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={fontThemeSelectValue}
                            onChange={(event) => {
                              handleThemeChange(null, event.target.value)
                            }}
                          >
                            <MenuItem value="arial">Arial</MenuItem>
                            <MenuItem value="roboto">Roboto</MenuItem>
                            <MenuItem value="vollkorn">Vollkorn</MenuItem>
                          </Select>
                        </FormControl>

                      </EmbedHighlight>
                    </Grid>
                  </>
                  : ''
                }
              </>
              : ''
          }
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel >
  )
}