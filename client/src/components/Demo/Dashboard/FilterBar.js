import _ from 'lodash'
import React, { useState } from 'react';
import {
  Typography, Grid, TextField,
  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Slider, FormControl, InputLabel, Select, MenuItem, Switch
} from '@material-ui/core'
import { Autocomplete, ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import {
  ExpandMore, FilterList
} from '@material-ui/icons';
import { ApiHighlight, EmbedHighlight, EmbedMethodHighlight } from '../../Highlights/Highlight'; //ooops
import { NumberToColoredPercent } from '../../Accessories/NumberToColoredPercent';
import { CheckboxSVGMap } from "./CheckboxSvgMapRegion";
import { customUsa, lifetimeRevenueTierMap, lifetimeRevenueTierIconMap } from './helpers';

const { validIdHelper } = require('../../../tools');

export default function FilterBar(props) {
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


  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };



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