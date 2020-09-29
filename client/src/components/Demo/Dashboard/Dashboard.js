import $ from 'jquery';
import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import {
  AppBar, Tabs, Tab, Typography, Box, Grid, CircularProgress, Card, TextField, Toolbar, FormControlLabel, Switch, Chip,
  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails
} from '@material-ui/core'
import { Autocomplete, ToggleButton, ToggleButtonGroup, Skeleton } from '@material-ui/lab'
import { ExpandMore, FilterList } from '@material-ui/icons';

import { LookerEmbedSDK } from '@looker/embed-sdk'
import CodeFlyout from '../CodeFlyout';
import rawSampleCode from '!!raw-loader!./Dashboard.js'; // eslint-disable-line import/no-webpack-loader-syntax
import useStyles from './styles.js';
import { TabPanel, a11yProps } from './helpers.js';
import BottomBar from '../../Material/BottomBar.js'
import { ApiHighlight, EmbedHighlight } from '../../Highlights/Highlight';
import { NumberToColoredPercent } from '../../Accessories/NumberToColoredPercent';
import AppContext from '../../../AppContext';
//new
import Usa from "@svg-maps/usa";
// import { SVGMap, CheckboxSVGMap } from "react-svg-map";
import CheckboxSVGMap from '../../MapSvg/checkbox-svg-map'
import "react-svg-map/lib/index.css";


const { validIdHelper } = require('../../../tools');
// console.log('CheckboxSVGMap', CheckboxSVGMap)

export default function Dashboard(props) {
  const topBarBottomBarHeight = 112;
  const [value, setValue] = useState(0);
  const [iFrameExists, setIFrame] = useState(0);
  const [apiContent, setApiContent] = useState([]);
  const [dashboardObj, setDashboardObj] = useState({});
  const [clientSideCode, setClientSideCode] = useState('');
  const [serverSideCode, setServerSideCode] = useState('');
  const [toggleValue, setToggleValue] = useState('');
  const [dashboardOptions, setDashboardOptions] = useState({});
  const [regionValue, setRegionValue] = useState('All');
  const { codeShow, toggleCodeShow } = useContext(AppContext)
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

  const performLookerApiCalls = function (lookerContent) {
    $(`.embedContainer.${validIdHelper(demoComponentType)}:visible`).html('')
    setIFrame(0)
    setApiContent([])
    lookerContent.map(async lookerContent => {
      let dashboardId = lookerContent.id;
      // let dashboardSlug = lookerContent.slug;
      LookerEmbedSDK.createDashboardWithId(dashboardId) //dashboardSlug
        .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${dashboardId}`))
        .withClassName('iframe')
        .withNext()
        // .withNext(lookerContent.isNext || false) //how can I make this dynamic based on prop??
        .withTheme(lookerContent.theme || 'atom_fashion')
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
          let stringifiedQuery = encodeURIComponent(JSON.stringify(jsonQuery))
          let lookerResponse = await fetch('/runinlinequery/' + stringifiedQuery + '/json', {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          })
          let lookerResponseData = await lookerResponse.json();
          let queryResultsForDropdown = [];
          let desiredProperty = Object.keys(lookerResponseData.queryResults[0])[0];

          for (let i = 0; i < lookerResponseData.queryResults.length; i++) {
            queryResultsForDropdown.push({
              'label': lookerResponseData.queryResults[i][desiredProperty],
              'trend': (lookerResponseData.queryResults[i]['trend']) ? lookerResponseData.queryResults[i]['trend'] : undefined
            })
          }


          // setApiContent(apiContent => {
          //   return [...apiContent, queryResultsForDropdown]
          // });
          //needed solution for ordering apiContent to match order
          //of content from usecaseContent

          orderedArrayForApiContent[index] = queryResultsForDropdown
          setApiContent([...orderedArrayForApiContent])

          if (serverSideCode.length === 0) setServerSideCode(lookerResponseData.code);
        })
      }

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

  return (
    <div className={`${classes.root} demoComponent`}
      style={{ height }}>
      <Card elevation={1} className={`${classes.padding30} ${classes.height100Percent}`}>
        <Grid container>
          <div className={`${classes.root}`}>
            {lookerContent[0].hasOwnProperty("filters") &&
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
  console.log('FilterBar')
  const { staticContent, staticContent: { lookerContent }, staticContent: { type }, classes,
    apiContent, customFilterAction, regionValue, setRegionValue, toggleValue, handleToggle } = props;
  console.log('apiContent', apiContent)

  const [expanded, setExpanded] = useState(true);
  const [selectedLocationIdsByRegion, setSelectedLocationIdsByRegion] = useState([]);

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
          return { ...location, region: "West" }
        // default:
        //   return location
      }
    })
  };

  // console.log('Usa', Usa)
  // console.log('customUsa', customUsa)
  // console.log('selectedLocationIdsByRegion', selectedLocationIdsByRegion)


  useEffect(() => {
    console.log('useEffect')
    console.log('selectedLocationIdsByRegion', selectedLocationIdsByRegion)
  }, [selectedLocationIdsByRegion]);


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
        {
          lookerContent[0].filters || lookerContent[0].dynamicFieldLookUp ?
            <Grid
              container spacing={3}>
              {apiContent.map((item, index) => {
                return (
                  lookerContent[0].filterComponents[index] === 'autocomplete' ?
                    <Grid item sm={6}>
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
                      <Grid item sm={3}>
                        <ApiHighlight classes={classes}
                          key={validIdHelper(`dashEmbed-${type}${lookerContent.id}-${index}`)} >
                          <Typography className={`${classes.heading} ${classes.ml12}`}>Selected region: {regionValue.length ? regionValue : "None"}</Typography>
                          <CheckboxSVGMap map={customUsa}
                            onChange={(locations) => {
                              let associatedRegion = locations[0].region;
                              setRegionValue(associatedRegion)
                              customFilterAction(lookerContent[0].id,
                                lookerContent[0].filters[index].filterName,
                                (associatedRegion) ? associatedRegion : '')
                            }}
                          />;
                          </ApiHighlight>
                      </Grid>
                      : 'ooooopppp')
              })}
              <Grid item sm={1} />
              {lookerContent[0].dynamicFieldLookUp ?
                <EmbedHighlight classes={classes} >
                  <Grid item sm={5}>
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
                  </Grid>
                </EmbedHighlight>
                : ''
              }
            </Grid> : ''
        }
      </ExpansionPanelDetails>
    </ExpansionPanel >
  )
}