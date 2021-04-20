import _ from 'lodash'
import React from 'react';
import { Grid, Typography, List } from '@material-ui/core'
import { validIdHelper } from '../utils/tools';
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
  hiddenFilterValue,
  nativeFiltersThemeToggleValue
}) => {
  // console.log("AdjacentContainer")
  // console.log({ lightThemeToggleValue })
  return (
    <Grid item
      sm={makeShiftDrawerOpen ? container.gridWidth ? container.gridWidth : 3 : "auto"}

    >
      <div className={classes.padding10}>
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
          makeShiftDrawerOpen ?

            <Grid
              container
            >

              {/* logic for adjacentContainer label */}
              {container.label ?
                <Typography variant="h6" display="block" className={classes.w100}>
                  {container.label}
                </Typography>
                : ""}

              {/* 
          logic for showing adjacentContainerChildren
          if it doesn't require selection, show everything
          if it does require selection and there isn't one, 
          only show the message for selecting one
          */}
              {container.requiresSelection && !hiddenFilterValue ?

                <Typography variant="subtitle1" color="secondary" >
                  {container.requiresSelectionMessage}
                </Typography>
                : container.items.map((item, index) => {

                  let ItemComponent = item.component;
                  let HighlightComponent = item.highlightComponent || undefined;
                  //api driven content
                  if (apiContent && apiContent[item.apiKey]) {
                    return (
                      item.apiKey === "trends" ?
                        <HighlightComponent classes={classes} key={`HighlightComponent-${index}`}>
                          < List
                            className={classes.inlineList}
                            component="div"
                            disablePadding
                          >
                            {apiContent[item.apiKey].map((apiItem, index) => {

                              return (
                                <ItemComponent
                                  key={validIdHelper(`${apiItem.label}-trendItem-${index}`)}
                                  id={validIdHelper(`${apiItem.label}-trendItem-${index}`)}
                                  apiItem={apiItem}
                                  item={item}
                                  classes={classes}
                                  index={index}
                                  helperFunctionMapper={helperFunctionMapper}
                                />
                              )
                            })}
                          </List>
                        </HighlightComponent>

                        :
                        <Grid key={`GridItem-apiKey-${index}`} item sm={item.gridWidth ? item.gridWidth : null}>
                          <ItemComponent
                            classes={classes}
                            apiContent={apiContent[item.apiKey]}
                            action={customFilterAction}
                            filterItem={item}
                            index={index}
                            fontThemeSelectValue={fontThemeSelectValue}
                          />
                        </Grid>
                    )
                  }
                  //static content
                  else if (!item.hasOwnProperty("apiKey")) {
                    return (
                      <Grid key={`GridItem-nonApiKey-${index}`} item sm={item.gridWidth ? item.gridWidth : null}>
                        <ItemComponent
                          key={validIdHelper(`${item.label}-ItemComponent-${index}`)}
                          classes={classes}
                          filterItem={item}
                          helperFunctionMapper={helperFunctionMapper}
                          action={customFilterAction || null}
                          lightThemeToggleValue={lightThemeToggleValue}
                          fontThemeSelectValue={fontThemeSelectValue}
                          handleRenderModal={handleRenderModal}
                          hiddenFilterValue={hiddenFilterValue}
                          container={container}
                          nativeFiltersThemeToggleValue={nativeFiltersThemeToggleValue}
                        > {item.label}</ItemComponent>
                      </Grid>
                    )
                  }
                })}
            </Grid> : ""
        }
      </div>
    </Grid>
  )
}