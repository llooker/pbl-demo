import _ from 'lodash'
import React from 'react';
import { Grid, List, Box } from '@material-ui/core'
import { appContextMap, validIdHelper } from '../../utils/tools';
import { ChevronLeft, Menu } from '@material-ui/icons';

export const AdjacentContainer = ({
  classes,
  container,
  makeShiftDrawerOpen,
  setMakeShiftDrawerOpen,
  apiContent,
  helperFunctionMapper,
  customFilterAction,
  lightThemeToggleValue,
  fontThemeSelectValue,
  handleRenderModal,
  hiddenFilterValue
}) => {
  // console.log("AdjacentContainer")
  // console.log({ container })
  // console.log({ makeShiftDrawerOpen })
  // console.log({ setMakeShiftDrawerOpen })
  // console.log({ apiContent })
  // console.log({ helperFunctionMapper })
  // console.log({ classes })

  return (
    <Grid item
      sm={makeShiftDrawerOpen ? container.gridWidth ? container.gridWidth : 3 : "auto"}

    >
      {
        container.collapsable ? makeShiftDrawerOpen ?
          <ChevronLeft
            onClick={() => setMakeShiftDrawerOpen(!makeShiftDrawerOpen)}
            aria-label="close menu"
          /> :
          <Menu
            onClick={() => setMakeShiftDrawerOpen(!makeShiftDrawerOpen)}
            aria-label="open menu"
          />
          : ""
      }

      <Grid container style={container.collapsable ? makeShiftDrawerOpen ? { display: "block" } : { display: "none" } : {}}>

        {container.items.map((item, index) => {
          let ItemComponent = item.component;
          //api driven content
          if (apiContent && apiContent[item.apiKey]) {
            return (
              item.apiKey === "trends" ?
                apiContent[item.apiKey].map((apiItem, index) => {

                  return (
                    <ItemComponent
                      key={validIdHelper(`${apiItem.label}-trendItem-${index}`)}
                      id={validIdHelper(`${apiItem.label}-trendItem-${index}`)}
                      apiItem={apiItem}
                      item={item}
                      classes={classes}
                      index={index}
                    />
                  )
                })
                :
                <ItemComponent
                  classes={classes}
                  apiContent={apiContent[item.apiKey]}
                  action={customFilterAction}
                  filterItem={item}
                  index={index}
                  lightThemeToggleValue={lightThemeToggleValue}
                  fontThemeSelectValue={fontThemeSelectValue}
                />
            )
          }
          //static content
          else if (!item.hasOwnProperty("apiKey")) {
            return (
              <Grid item sm={item.gridWidth ? item.gridWidth : null}>
                <ItemComponent
                  key={validIdHelper(`${item.label}-ItemComponent-${index}`)}
                  classes={classes}
                  filterItem={item}
                  helperFunctionMapper={helperFunctionMapper}
                  action={customFilterAction}
                  filterItem={item}
                  lightThemeToggleValue={lightThemeToggleValue}
                  fontThemeSelectValue={fontThemeSelectValue}
                  handleRenderModal={handleRenderModal}
                  hiddenFilterValue={hiddenFilterValue}
                > {item.label}</ItemComponent>
              </Grid>
            )
          }
        })}
      </Grid>
    </Grid>
  )
}