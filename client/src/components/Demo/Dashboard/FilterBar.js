import _ from 'lodash'
import React, { useState } from 'react';
import { Typography, Grid, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
import { ExpandMore, FilterList, VerticalSplit, HorizontalSplit } from '@material-ui/icons';

import AutoComplete from './AutoComplete'
import MapFilter from './MapFilter'
import RangeSlider from './RangeSlider'
import ToggleApi from './ToggleApi'
import ToggleTile from './ToggleTile'
import ToggleVisColor from './ToggleVisColor'
import SwitchTheme from './SwitchTheme'
import SelectFont from './SelectFont'


export default function FilterBar(props) {
  const { staticContent, staticContent: { lookerContent }, staticContent: { type }, classes,
    apiContent, customFilterAction, tileToggleValue, handleTileToggle, visColorToggleValue,
    handleVisColorToggle, lightThemeToggleValue, fontThemeSelectValue, handleThemeChange,
    horizontalLayout, setHorizontalLayout
  } = props;

  const [expanded, setExpanded] = useState(true);


  return (

    <ExpansionPanel
      expanded={expanded}
      // onChange={() => setExpanded(!expanded)}
      className={`${classes.w100} MuiExpansionPanel-root`}
      elevation={0}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMore onClick={() => {
          setExpanded(!expanded)
        }} />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <FilterList /><Typography className={`${classes.heading} ${classes.ml12}`}>Filter:</Typography>


        {horizontalLayout ? <HorizontalSplit
          className={classes.mlAuto}
          onClick={(e) => {
            setHorizontalLayout(!horizontalLayout)
          }} /> : <VerticalSplit
            className={classes.mlAuto}
            onClick={(e) => {
              setHorizontalLayout(!horizontalLayout)
            }}
          />}


      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid
          container spacing={3}>
          <>
            {lookerContent[0].filterComponents.map((item, index) => {
              return (
                lookerContent[0].filterComponents[index] === 'autocomplete' ?
                  <AutoComplete
                    lookerContent={lookerContent}
                    apiContent={apiContent[index]}
                    index={index}
                    classes={classes}
                    customFilterAction={customFilterAction}
                    type={type}
                    horizontalLayout={horizontalLayout}
                  />
                  : lookerContent[0].filterComponents[index] === 'mapfilter' ?
                    <MapFilter
                      lookerContent={lookerContent}
                      apiContent={apiContent[index]}
                      index={index}
                      classes={classes}
                      customFilterAction={customFilterAction}
                      type={type}
                      horizontalLayout={horizontalLayout}
                    />
                    : lookerContent[0].filterComponents[index] === 'rangeslider' ?
                      <RangeSlider
                        lookerContent={lookerContent}
                        apiContent={apiContent[index]}
                        index={index}
                        classes={classes}
                        customFilterAction={customFilterAction}
                        type={type}
                        horizontalLayout={horizontalLayout}
                      />
                      : lookerContent[0].filterComponents[index] === 'togglebuttonapi' ?
                        <ToggleApi
                          lookerContent={lookerContent}
                          apiContent={apiContent[index]}
                          index={index}
                          classes={classes}
                          customFilterAction={customFilterAction}
                          type={type}
                          horizontalLayout={horizontalLayout}
                        />

                        //couldn't get this to work, for now
                        // : lookerContent[0].filterComponents[index] === 'togglebutton' ?

                        //   // <h1>togglebuttoncomingsoon!</h1>

                        //   <Toggle
                        //     lookerContent={lookerContent}
                        //     // apiContent={apiContent[index]}
                        //     index={index}
                        //     classes={classes}
                        //     // customFilterAction={customFilterAction}
                        //     type={type}
                        //     value={props[lookerContent[0].filters[index].value]}
                        //     onChange={props[lookerContent[0].filters[index].onChangeFunctionName]}
                        //   />

                        :
                        '')
            })}
            {/* should use Toggle component??? */}
            {lookerContent[0].dynamicFieldLookUp ?
              <ToggleTile
                lookerContent={lookerContent}
                classes={classes}
                type={type}
                tileToggleValue={tileToggleValue}
                handleTileToggle={handleTileToggle}
                horizontalLayout={horizontalLayout}
              />
              : ''
            }
            {lookerContent[0].dynamicVisConfig ?
              <ToggleVisColor
                lookerContent={lookerContent}
                classes={classes}
                type={type}
                visColorToggleValue={visColorToggleValue}
                handleVisColorToggle={handleVisColorToggle}
                horizontalLayout={horizontalLayout}
              />
              : ''
            }
            {lookerContent[0].dynamicThemeMode ?
              <SwitchTheme
                lookerContent={lookerContent}
                classes={classes}
                type={type}
                lightThemeToggleValue={lightThemeToggleValue}
                handleThemeChange={handleThemeChange}
                horizontalLayout={horizontalLayout}
              />
              : ''
            }
            {/* need Select component */}
            {lookerContent[0].dynamicThemeFont ?

              <SelectFont
                lookerContent={lookerContent}
                classes={classes}
                type={type}
                fontThemeSelectValue={fontThemeSelectValue}
                handleThemeChange={handleThemeChange}
                horizontalLayout={horizontalLayout}
              />
              : ''
            }


          </>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel >
  )
}


