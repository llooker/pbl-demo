import React from 'react';
import { Grid } from '@material-ui/core'
import { AutoComplete, ToggleTile, ToggleVisColor, SwitchTheme, SelectFont, MapFilter, RangeSlider, ToggleApi, ActionButton, Dropdown } from "@pbl-demo/components/Filters";
import { validIdHelper } from '../../utils/tools';


export const FilterBarChildren = ({ classes, apiContent, customFilterAction, lookerContent, type, helperFunctionMapper, lightThemeToggleValue, fontThemeSelectValue }) => {
  return (
    <Grid
      container spacing={3}>
      {lookerContent[0].filters.map((filterItem, index) => {
        return (
          filterItem.component === 'autocomplete' ?
            <Grid
              item
              sm={12}
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

              <Grid
                item
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

                <Grid
                  item
                  key={validIdHelper(`${type}-dynamicThemeMode`)}>
                  <SwitchTheme
                    classes={classes}
                    filterItem={filterItem}
                    helperFunctionMapper={helperFunctionMapper}
                  />
                </Grid>
                :
                filterItem.component === "dropdown" ?
                  <Grid item
                    sm
                    key={validIdHelper(`${type}-dynamicThemeFont`)} //needs work
                  >
                    <Dropdown
                      classes={classes}
                      filterItem={filterItem}
                      helperFunctionMapper={helperFunctionMapper}
                    />
                  </Grid> :
                  filterItem.component === 'mapfilter' ?

                    <Grid item
                      key={validIdHelper(`${type}-${filterItem.component}-${index}`)}>
                      <MapFilter
                        classes={classes}
                        action={customFilterAction}
                        filterItem={filterItem}
                      />
                    </Grid>
                    : filterItem.component === 'rangeslider' ?
                      <Grid item
                        key={validIdHelper(`${type}-${filterItem.component}-${index}`)}>
                        <RangeSlider
                          apiContent={apiContent[filterItem.component]}
                          classes={classes}
                          action={customFilterAction}
                          filterItem={filterItem}
                        />
                      </Grid>
                      : filterItem.component === 'togglebuttonapi' ?
                        <Grid item
                          key={validIdHelper(`${type}-${filterItem.component}-${index}`)}>
                          <ToggleApi
                            apiContent={apiContent[filterItem.component]}
                            classes={classes}
                            action={customFilterAction}
                            filterItem={filterItem}
                          />
                        </Grid>
                        :
                        '')
      })}
    </Grid>
  )
}
