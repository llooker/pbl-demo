import React from 'react';
import { Grid } from '@material-ui/core'

// import AutoComplete from './AutoComplete'
import MapFilter from './MapFilter'
import RangeSlider from './RangeSlider'
import ToggleApi from './ToggleApi'
import ToggleTile from './ToggleTile'
import ToggleVisColor from './ToggleVisColor'
import SwitchTheme from './SwitchTheme'
import SelectFont from './SelectFont'

import { Button } from "@pbl-demo/components";
import { AutoComplete } from "@pbl-demo/components";


const { validIdHelper } = require('../../../tools');

export default function FilterBarChildren({ classes, apiContent, customFilterAction, tileToggleValue, handleTileToggle, visColorToggleValue,
  handleVisColorToggle, lightThemeToggleValue, fontThemeSelectValue, handleThemeChange, horizontalLayout, setHorizontalLayout,
  lookerContent, type }) {
  return (
    <Grid
      container spacing={3}>
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
              key={validIdHelper(`${type}-${lookerContent[0].filterComponents[index]}-${index}`)}
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
                key={validIdHelper(`${type}-${lookerContent[0].filterComponents[index]}-${index}`)}
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
                  key={validIdHelper(`${type}-${lookerContent[0].filterComponents[index]}-${index}`)}
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
                    key={validIdHelper(`${type}-${lookerContent[0].filterComponents[index]}-${index}`)}
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
      {lookerContent[0].dynamicFieldLookUp ?
        <ToggleTile
          lookerContent={lookerContent}
          classes={classes}
          type={type}
          tileToggleValue={tileToggleValue}
          handleTileToggle={handleTileToggle}
          horizontalLayout={horizontalLayout}
          key={validIdHelper(`${type}-dynamicFieldLookUp`)}
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
          key={validIdHelper(`${type}-dynamicVisConfig`)}
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
          key={validIdHelper(`${type}-dynamicThemeMode`)}
        />
        : ''
      }
      {lookerContent[0].dynamicThemeFont ?
        <SelectFont
          lookerContent={lookerContent}
          classes={classes}
          type={type}
          fontThemeSelectValue={fontThemeSelectValue}
          handleThemeChange={handleThemeChange}
          horizontalLayout={horizontalLayout}
          key={validIdHelper(`${type}-dynamicThemeFont`)}
        />
        : ''
      }


      <Button>Hello world?????</Button>
    </Grid>
  )
}
