import React from 'react';
import { Grid } from '@material-ui/core'
import { AutoComplete, ToggleTile, ToggleVisColor, SwitchTheme, SelectFont, MapFilter, RangeSlider, ToggleApi, ActionButton } from "@pbl-demo/components/Filters";
import { validIdHelper } from '../../utils/tools';


export const FilterBarChildren = ({ classes, apiContent, customFilterAction, horizontalLayout, lookerContent, type, helperFunctionMapper, lightThemeToggleValue, fontThemeSelectValue }) => {
  return (
    <Grid
      container spacing={3}>
      {lookerContent[0].filters.map((filterItem, index) => {
        return (
          filterItem.component === 'autocomplete' ?
            <Grid
              item sm={horizontalLayout ? 3 : 12}
              key={validIdHelper(`${type}-${filterItem.component}-${index}`)}>
              <AutoComplete
                apiContent={apiContent[filterItem.component]} //new
                index={index}
                classes={classes}
                action={customFilterAction}
                filterItem={filterItem}
              />
            </Grid>

            : filterItem.component === 'togglebutton' ?

              <Grid item sm={horizontalLayout ? 3 : 12}
                key={validIdHelper(`${type}-${filterItem.label}`)}>
                {filterItem.label === "Dynamic Tiles" ?
                  <ToggleTile
                    classes={classes}
                    filterItem={filterItem}
                    helperFunctionMapper={helperFunctionMapper}
                    lightThemeToggleValue={lightThemeToggleValue}
                    fontThemeSelectValue={fontThemeSelectValue}
                  /> :
                  <ToggleVisColor
                    classes={classes}
                    filterItem={filterItem}
                    helperFunctionMapper={helperFunctionMapper}
                    lightThemeToggleValue={lightThemeToggleValue}
                    fontThemeSelectValue={fontThemeSelectValue}
                  />}
              </Grid>
              :
              filterItem.component === 'switch' ?

                <Grid item sm={horizontalLayout ? 1 : 12}
                  key={validIdHelper(`${type}-dynamicThemeMode`)}>
                  <SwitchTheme
                    classes={classes}
                    filterItem={filterItem}
                    helperFunctionMapper={helperFunctionMapper}
                  />
                </Grid>
                :
                filterItem.component === "select" ? <Grid item sm={horizontalLayout ? 2 : 12}
                  key={validIdHelper(`${type}-dynamicThemeFont`)}>
                  {/* test for now */}
                  <SelectFont
                    classes={classes}
                    // fontThemeSelectValue={fontThemeSelectValue}
                    // handleThemeChange={handleThemeChange}
                    filterItem={filterItem}
                    helperFunctionMapper={helperFunctionMapper}
                  />
                </Grid> :
                  filterItem.component === 'mapfilter' ?

                    <Grid item sm={horizontalLayout ? 3 : 12}
                      key={validIdHelper(`${type}-${filterItem.component}-${index}`)}>
                      <MapFilter
                        classes={classes}
                        action={customFilterAction}
                        filterItem={filterItem}
                      />
                    </Grid>
                    : filterItem.component === 'rangeslider' ?
                      <Grid item sm={horizontalLayout ? 3 : 12}
                        key={validIdHelper(`${type}-${filterItem.component}-${index}`)}>
                        <RangeSlider
                          apiContent={apiContent[filterItem.component]}
                          classes={classes}
                          action={customFilterAction}
                          filterItem={filterItem}
                        />
                      </Grid>
                      : filterItem.component === 'togglebuttonapi' ?
                        <Grid item sm={horizontalLayout ? 3 : 12}
                          key={validIdHelper(`${type}-${filterItem.component}-${index}`)}>
                          <ToggleApi
                            apiContent={apiContent[filterItem.component]}
                            classes={classes}
                            action={customFilterAction}
                            filterItem={filterItem}
                          />
                        </Grid>
                        : filterItem.component === 'actionbutton' ?
                          <Grid item sm={horizontalLayout ? 3 : 12}
                            key={validIdHelper(`${type}-${filterItem.component}-${index}`)}>
                            <ActionButton classes={classes} filterItem={filterItem} />
                          </Grid> :
                          '')
      })}
    </Grid>
  )
}
