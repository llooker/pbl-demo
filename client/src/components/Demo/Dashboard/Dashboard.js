import $ from 'jquery';
import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import {
  AppBar, Tabs, Tab, Typography, Box, Grid, CircularProgress, Card, TextField, Toolbar, FormControlLabel, Switch, Chip,
  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Slider
} from '@material-ui/core'
import { Autocomplete, ToggleButton, ToggleButtonGroup, Skeleton, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab'
import {
  ExpandMore, FilterList, SentimentDissatisfied, SentimentSatisfied, SentimentVerySatisfied,
  FileCopy, Save, Print, Share, Favorite, ColorLens
} from '@material-ui/icons';


import { LookerEmbedSDK } from '@looker/embed-sdk'
import CodeFlyout from '../CodeFlyout';
import rawSampleCode from '!!raw-loader!./Dashboard.js'; // eslint-disable-line import/no-webpack-loader-syntax
import useStyles from './styles.js';
import { TabPanel, a11yProps } from './helpers.js';
import BottomBar from '../../Material/BottomBar.js'
import { ApiHighlight, EmbedHighlight, EmbedMethodHighlight } from '../../Highlights/Highlight';
import { NumberToColoredPercent } from '../../Accessories/NumberToColoredPercent';
import AppContext from '../../../AppContext';
//new
import Usa from "@svg-maps/usa";
// import "react-svg-map/lib/index.css";
import { CheckboxSVGMap } from "./CheckboxSvgMapRegion";
// import SpeedDials from "./SpeedDial";

const { validIdHelper } = require('../../../tools');

export default function Dashboard(props) {
  const topBarBottomBarHeight = 112;
  const [value, setValue] = useState(0);
  const [iFrameExists, setIFrame] = useState(0);
  const [apiContent, setApiContent] = useState(undefined);
  const [dashboardObj, setDashboardObj] = useState({});
  const [clientSideCode, setClientSideCode] = useState('');
  // const [serverSideCode, setServerSideCode] = useState('');
  const [toggleValue, setToggleValue] = useState('');
  const [dashboardOptions, setDashboardOptions] = useState({});
  const [regionValue, setRegionValue] = useState('Pacific,South,Mountain,Midwest,Northeast');
  // const { codeShow, toggleCodeShow } = useContext(AppContext)
  const { togglePayWallModal, show, codeShow, sdk } = useContext(AppContext)
  const [height, setHeight] = useState((window.innerHeight - topBarBottomBarHeight));



  const classes = useStyles();
  const { staticContent: { lookerContent }, staticContent: { type }, activeTabValue, handleTabChange, lookerUser, lookerHost } = props;
  const demoComponentType = type || 'code flyout';

  //handle tab change
  const handleChange = (event, newValue) => {
    handleTabChange(0);
    setValue(newValue);
  };

  const handleToggle = (event, newValue) => {
    // console.log('handleToggle')
    // console.log('newValue', newValue)
    setToggleValue(newValue)
    const filteredLayout = _.filter(dashboardOptions.layouts[0].dashboard_layout_components, (row) => {
      return (lookerContent[0].dynamicFieldLookUp[newValue].indexOf(dashboardOptions.elements[row.dashboard_element_id].title) > -1)
    })

    const newDashboardLayout = {
      ...dashboardOptions.layouts[0],
      dashboard_layout_components: filteredLayout
    }
    dashboardObj.setOptions({ "layouts": [newDashboardLayout] })
  };

  useEffect(() => {
    setTimeout(() => performLookerApiCalls([...lookerContent]), 1000)
    setClientSideCode(rawSampleCode)
  }, [lookerContent, lookerUser]);


  useEffect(() => {
    if (Object.keys(dashboardOptions).length && Object.keys(dashboardObj).length && lookerContent[0].dynamicFieldLookUp) {
      handleToggle(null, Object.keys(lookerContent[0].dynamicFieldLookUp)[0])
    }
  }, [dashboardOptions]);

  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - topBarBottomBarHeight)));
  })

  const performLookerApiCalls = function (lookerContent, dynamicTheme) {
    console.log('performLookerApiCalls')
    console.log('dynamicTheme', dynamicTheme)
    $(`.embedContainer.${validIdHelper(demoComponentType)}:visible`).html('')
    setIFrame(0)
    setApiContent(undefined)
    lookerContent.map(async lookerContent => {
      let dashboardId = lookerContent.id;
      let themeToUse = dynamicTheme || lookerContent.theme || 'atom_fashion';
      console.log("themeToUse", themeToUse)
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

      if (lookerContent.hasOwnProperty('filters')) {
        //get inline query from usecase file & set user attribute dynamically
        //iterating over filters
        let orderedArrayForApiContent = []
        lookerContent.filters.map(async (item, index) => {
          // console.log('item', item)
          let jsonQuery = lookerContent.inlineQueries[index];
          jsonQuery.filters = {
            ...jsonQuery.filters,
            [item.desiredFilterName]: lookerUser.user_attributes.brand
          };
          // let stringifiedQuery = encodeURIComponent(JSON.stringify(jsonQuery))
          // let lookerResponse = await fetch('/runinlinequery/' + stringifiedQuery + '/json', {
          //   method: 'GET',
          //   headers: {
          //     Accept: 'application/json',
          //     'Content-Type': 'application/json'
          //   }
          // })
          // let lookerResponseData = await lookerResponse.json();

          let lookerResponseData = await sdk.ok(sdk.run_inline_query({ result_format: lookerContent.result_format || 'json', body: jsonQuery }));

          let queryResultsForDropdown = [];
          let desiredProperty = Object.keys(lookerResponseData[0])[0];

          for (let i = 0; i < lookerResponseData.length; i++) {
            queryResultsForDropdown.push({
              'label': lookerResponseData[i][desiredProperty],
              'trend': (lookerResponseData[i]['trend']) ? lookerResponseData[i]['trend'] : undefined
            })
          }


          // setApiContent(apiContent => {
          //   return [...apiContent, queryResultsForDropdown]
          // });
          //needed solution for ordering apiContent to match order
          //of content from usecaseContent

          orderedArrayForApiContent[index] = queryResultsForDropdown
          setApiContent([...orderedArrayForApiContent])

          // if (serverSideCode.length === 0) setServerSideCode(lookerResponseData.code);
        })
      }

    })
  }

  const customFilterAction = (dashboardId, filterName, newFilterValue) => {
    // console.log('customFilterAction')
    // console.log('dashboardId', dashboardId)
    // console.log('filterName', filterName)
    // console.log('newFilterValue', newFilterValue)
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

  const changeTheme = (newValue) => {
    console.log('changeTheme')
    console.log('newValue', newValue)
    performLookerApiCalls(lookerContent, newValue)
  }


  console.log('apiContent', apiContent)

  return (
    <div className={`${classes.root} demoComponent`}
      style={{ height }}>
      <Card elevation={1} className={`${classes.padding30} ${classes.height100Percent}`}>
        <Grid container>
          <div className={`${classes.root}`}>
            {lookerContent[0].hasOwnProperty("filters") &&
              apiContent &&
              apiContent.length === lookerContent[0].filters.length ?
              <Grid item
                sm={12}
                key={validIdHelper(`${demoComponentType}-FilterBar-${lookerContent[0].id}`)}
              >
                <FilterBar {...props}
                  classes={classes}
                  apiContent={apiContent}
                  customFilterAction={customFilterAction}
                  regionValue={regionValue}
                  setRegionValue={setRegionValue}
                  toggleValue={toggleValue}
                  handleToggle={handleToggle}
                  changeTheme={changeTheme}
                />
              </Grid> :
              lookerContent[0].hasOwnProperty("filters") ?
                <Skeleton variant="rect" animation="wave" className={classes.skeleton} /> :
                ''}


            {
              iFrameExists
                ? ''
                :
                <Grid item sm={12} style={{ height: height - 30 - ($('.MuiExpansionPanel-root:visible').innerHeight() || 0) }}>
                  <Card className={`${classes.card} ${classes.flexCentered}`}
                    elevation={0}
                    mt={2}
                    style={{ height: height - 30 - ($('.MuiExpansionPanel-root:visible').innerHeight() || 0) }}>
                    <CircularProgress className={classes.circularProgress} />
                  </Card>
                </Grid>
            }
            <Box
              className={iFrameExists ? ` ` : `${classes.hidden} `}
              style={{ height: height - 30 - ($('.MuiExpansionPanel-root:visible').innerHeight() || 0) }}
            >
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
    </div>
  )
}




function FilterBar(props) {
  // console.log('FilterBar')
  const { staticContent, staticContent: { lookerContent }, staticContent: { type }, classes,
    apiContent, customFilterAction, regionValue, setRegionValue, toggleValue, handleToggle, changeTheme } = props;
  // console.log('apiContent', apiContent)

  const [expanded, setExpanded] = useState(true);
  const [sliderValue, setSliderValue] = React.useState([]);
  const [lifetimeRevenueTierValue, setLifetimeRevenueTierValue] = useState('0-24');
  const [speedDialOpen, setSpeedDialOpen] = React.useState(false);

  const handleExpansionPanel = (event, newValue) => {
    setExpanded(expanded ? false : true);
  };

  const customUsa = {
    ...Usa,
    label: "Custom map label",
    locations: Usa.locations.map(location => {
      // Modify each location
      // console.log('location', location)
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

  const handleSpeedDialClose = (newValue) => {
    console.log('handleSpeedDialClose')
    console.log('newValue', newValue)
    changeTheme(newValue)
    setSpeedDialOpen(false);
  };

  const handleSpeedDialOpen = () => {
    setSpeedDialOpen(true);
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

  const actions = [
    {
      icon: <ColorLens style={{
        backgroundColor: "#4a4842",
        // color: "#4a4842"
      }} />, name: 'Dark'
    },
    {
      icon: <ColorLens style={{
        backgroundColor: "#f6f8fa",
        // color: "#f6f8fa" 
      }} />, name: 'Light'
    }
  ];

  // console.log('apiContent', apiContent)
  // console.log('lookerContent[0].filters.length', lookerContent[0].filters.length)
  // console.log('lookerContent[0].filterComponents.length', lookerContent[0].filterComponents.length)
  // console.log('lookerContent[0].inlineQueries.length', lookerContent[0].inlineQueries.length)

  return (

    <ExpansionPanel expanded={expanded} onChange={handleExpansionPanel} className={classes.w100} elevation={0}>
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
                    // <h1>lookerContent[0].filterComponents[index]</h1>
                    lookerContent[0].filterComponents[index] === 'autocomplete' ?
                      <Grid item sm={4}>

                        <ApiHighlight classes={classes}
                          key={validIdHelper(`dashEmbed-${type}${lookerContent.id}-${index}`)} >
                          <Autocomplete
                            id={`combo-box-dashboard-${lookerContent.id}`}
                            options={Array.isArray(apiContent[index]) ?
                              apiContent[index] :
                              []}
                            renderOption={(option) => (
                              <Grid container justify="space-between">
                                <Grid item>
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
                            style={{ width: 400 }}
                            onChange={(event, newValue) => {
                              customFilterAction(lookerContent[0].id,
                                lookerContent[0].filters[index].filterName,
                                (newValue) ? newValue.label : '')
                            }}
                            renderInput={(params) => <TextField {...params} label={lookerContent[0].filters[index].filterName} variant="outlined" />}
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
                              // component="span"
                              // color="secondary"
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
                                // component="span"
                                // color="secondary"
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
                                // component="span"
                                // color="secondary"
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
                          //lookerContent[0].filterComponents[index] === "togglebutton" ? " going to be toggle button " : 
                          '')
                })}
                {lookerContent[0].dynamicFieldLookUp ?
                  <>
                    <Grid item sm={2}>
                      <EmbedMethodHighlight classes={classes} >
                        <ToggleButtonGroup
                          value={toggleValue}
                          exclusive
                          onChange={handleToggle}
                          aria-label="text alignment"
                        >
                          {Object.keys(lookerContent[0].dynamicFieldLookUp).map(key => {
                            return (
                              <ToggleButton
                                key={validIdHelper(`dynamicDashToggle-${key}`)}
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
                {lookerContent[0].dynamicTheme ?
                  <>
                    <Grid item sm={4}>
                      <EmbedMethodHighlight classes={classes} >
                        <SpeedDial
                          ariaLabel="SpeedDial example"
                          className={classes.speedDial}
                          // hidden={hidden}
                          icon={<SpeedDialIcon />}
                          onClose={() => setSpeedDialOpen(false)}
                          onOpen={handleSpeedDialOpen}
                          open={speedDialOpen}
                          // direction={direction}
                          direction="right"
                        >
                          {actions.map((action) => (
                            <SpeedDialAction
                              key={action.name}
                              icon={action.icon}
                              tooltipTitle={action.name}
                              onClick={() => {
                                handleSpeedDialClose(action.name)
                              }}
                            />
                          ))}
                        </SpeedDial>

                      </EmbedMethodHighlight>
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