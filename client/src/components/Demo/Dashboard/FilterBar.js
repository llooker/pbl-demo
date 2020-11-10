import _ from 'lodash'
import React, { useState } from 'react';
import {
  Typography, Grid,
  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, FormControl, InputLabel, Select, MenuItem, Switch
} from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'; //Autocomplete
import {
  ExpandMore, FilterList
} from '@material-ui/icons';
import { EmbedHighlight, EmbedMethodHighlight } from '../../Highlights/Highlight';

import AutoComplete from './AutoComplete'
import MapFilter from './MapFilter'
import RangeSlider from './RangeSlider'
import Toggle from './Toggle'


const { validIdHelper } = require('../../../tools');

export default function FilterBar(props) {
  // console.log('FilterBar')
  const { staticContent, staticContent: { lookerContent }, staticContent: { type }, classes,
    apiContent, customFilterAction, regionValue, setRegionValue, tileToggleValue, handleTileToggle, //changeTheme,
    visColorToggleValue, handleVisColorToggle, lightThemeToggleValue, fontThemeSelectValue, handleThemeChange, isThemeableDashboard
  } = props;

  const [expanded, setExpanded] = useState(true);

  const handleExpansionPanel = (event, newValue) => {
    setExpanded(expanded ? false : true);
  };

  return (

    <ExpansionPanel
      expanded={expanded}
      onChange={handleExpansionPanel}
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
                      <AutoComplete
                        lookerContent={lookerContent}
                        apiContent={apiContent}
                        index={index}
                        classes={classes}
                        customFilterAction={customFilterAction}
                        type={type}
                      />
                      : lookerContent[0].filterComponents[index] === 'mapfilter' ?
                        <MapFilter
                          lookerContent={lookerContent}
                          apiContent={apiContent}
                          index={index}
                          classes={classes}
                          customFilterAction={customFilterAction}
                          type={type}
                          regionValue={regionValue}
                          setRegionValue={setRegionValue}
                        />
                        : lookerContent[0].filterComponents[index] === "rangeslider"
                          ?
                          <Grid container item sm={4} >
                            <RangeSlider
                              lookerContent={lookerContent}
                              apiContent={apiContent}
                              index={index}
                              classes={classes}
                              customFilterAction={customFilterAction}
                              type={type}
                            />
                            <Toggle
                              lookerContent={lookerContent}
                              apiContent={apiContent}
                              index={index}
                              classes={classes}
                              customFilterAction={customFilterAction}
                              type={type}
                            />
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


