import React from 'react';
import { Grid } from '@material-ui/core'

import MapFilter from './MapFilter'
import RangeSlider from './RangeSlider'
import ToggleApi from './ToggleApi'
import ToggleTile from './ToggleTile'
import ToggleVisColor from './ToggleVisColor'
import SwitchTheme from './SwitchTheme'
import SelectFont from './SelectFont'
import { AutoComplete } from "@pbl-demo/components";

const { validIdHelper } = require('../../../tools');

export default function FilterBarChildren({ classes, apiContent, customFilterAction, tileToggleValue, handleTileToggle, visColorToggleValue,
  handleVisColorToggle, lightThemeToggleValue, fontThemeSelectValue, handleThemeChange, horizontalLayout,
  lookerContent, type
}) {
  return (
    <Grid
      container spacing={3}>
      {lookerContent[0].filterComponents.map((item, index) => {
        return (
          lookerContent[0].filterComponents[index] === 'autocomplete' ?
            <Grid
              item sm={horizontalLayout ? 3 : 12}
              key={validIdHelper(`${type}-${lookerContent[0].filterComponents[index]}-${index}`)}>
              <AutoComplete
                lookerContent={lookerContent}
                apiContent={apiContent[index]}
                index={index}
                classes={classes}
                action={customFilterAction}
              />
            </Grid>
            : lookerContent[0].filterComponents[index] === 'mapfilter' ?

              <Grid item sm={horizontalLayout ? 3 : 12}
                key={validIdHelper(`${type}-${lookerContent[0].filterComponents[index]}-${index}`)}>
                <MapFilter
                  lookerContent={lookerContent}
                  apiContent={apiContent[index]}
                  index={index}
                  classes={classes}
                  action={customFilterAction}
                />
              </Grid>
              : lookerContent[0].filterComponents[index] === 'rangeslider' ?
                <Grid item sm={horizontalLayout ? 3 : 12}
                  key={validIdHelper(`${type}-${lookerContent[0].filterComponents[index]}-${index}`)}>
                  <RangeSlider
                    lookerContent={lookerContent}
                    apiContent={apiContent[index]}
                    index={index}
                    classes={classes}
                    action={customFilterAction}
                  />
                </Grid>
                : lookerContent[0].filterComponents[index] === 'togglebuttonapi' ?
                  <Grid item sm={horizontalLayout ? 3 : 12}
                    key={validIdHelper(`${type}-${lookerContent[0].filterComponents[index]}-${index}`)}>
                    <ToggleApi
                      lookerContent={lookerContent}
                      apiContent={apiContent[index]}
                      index={index}
                      classes={classes}
                      action={customFilterAction}
                    />
                  </Grid>

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
      {lookerContent[0].dynamicFieldLookUp ?
        <Grid item sm={horizontalLayout ? 3 : 12}
          key={validIdHelper(`${type}-dynamicFieldLookUp`)}>
          <ToggleTile
            lookerContent={lookerContent}
            classes={classes}
            tileToggleValue={tileToggleValue}
            handleTileToggle={handleTileToggle}
          />
        </Grid>
        : ''
      }
      {lookerContent[0].dynamicVisConfig ?
        <Grid item sm={horizontalLayout ? 2 : 12}
          key={validIdHelper(`${type}-dynamicVisConfig`)}>
          <ToggleVisColor
            lookerContent={lookerContent}
            classes={classes}
            visColorToggleValue={visColorToggleValue}
            handleVisColorToggle={handleVisColorToggle}
          />
        </Grid>
        : ''
      }
      {lookerContent[0].dynamicThemeMode ?
        <Grid item sm={horizontalLayout ? 1 : 12}
          key={validIdHelper(`${type}-dynamicThemeMode`)}>
          <SwitchTheme
            lookerContent={lookerContent}
            classes={classes}
            lightThemeToggleValue={lightThemeToggleValue}
            handleThemeChange={handleThemeChange}
          />
        </Grid>
        : ''
      }
      {lookerContent[0].dynamicThemeFont ?
        <Grid item sm={horizontalLayout ? 2 : 12}
          key={validIdHelper(`${type}-dynamicThemeFont`)}>
          <SelectFont
            lookerContent={lookerContent}
            classes={classes}
            fontThemeSelectValue={fontThemeSelectValue}
            handleThemeChange={handleThemeChange}
          />
        </Grid>
        : ''
      }
    </Grid>
  )
}
