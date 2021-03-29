import _ from 'lodash'
import React from 'react';
import { Grid } from '@material-ui/core'
import { validIdHelper } from '../../utils/tools';
import { ChevronLeft, AddCircleOutline } from '@material-ui/icons';

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

  return (
    <Grid item
      sm={makeShiftDrawerOpen ? container.gridWidth ? container.gridWidth : 3 : "auto"}
      className={classes.animatedGridItem} //not working
    >
      {
        container.collapsable ? makeShiftDrawerOpen ?
          <ChevronLeft
            onClick={() => setMakeShiftDrawerOpen(!makeShiftDrawerOpen)}
            aria-label="close menu"
          /> :
          <AddCircleOutline
            onClick={() => setMakeShiftDrawerOpen(!makeShiftDrawerOpen)}
            aria-label="open menu"
          />
          : ""
      }
      {
        makeShiftDrawerOpen ? <Grid container>
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
        </Grid> : ""
      }

    </Grid>
  )
}