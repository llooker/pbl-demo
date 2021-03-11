import _ from 'lodash'
import React from 'react';
import { Grid, List } from '@material-ui/core'
import { appContextMap, validIdHelper } from '../../utils/tools';
import { handleTileToggle, handleVisColorToggle, handleThemeChange, runInlineQuery } from './helpers';
import { TrendItem } from "@pbl-demo/components";
import { ChevronLeft, Menu } from '@material-ui/icons';

export const AdjacentContainer = ({ container, makeShiftDrawerOpen, setMakeShiftDrawerOpen, apiContent, helperFunctionMapper, classes }) => {
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


      < Grid container spacing={3}
        style={makeShiftDrawerOpen ? { display: "block" } : { display: "none" }}>
        {container.items.map(item => {
          let ItemComponent = item.component
          if (apiContent && apiContent[item.apiKey]) {
            return (
              < List
                disablePadding
                className={`${classes.inlineListPaddingTop10}`
                }
                component="div"
              >
                {
                  apiContent[item.apiKey].map((trendItem, index) => {

                    return (
                      <TrendItem
                        key={validIdHelper(`${trendItem.label}-trendItem-${index}`)}
                        fieldsOfInterest={item.fieldsOfInterest}
                        trendItem={trendItem}
                        classes={classes}
                        index={index}
                      />
                    )
                  })
                }
              </List>
            )
          }
          else {
            return (
              <Grid item sm={item.gridWidth ? item.gridWidth : null}>
                <ItemComponent
                  classes={classes}
                  filterItem={item}
                  helperFunctionMapper={helperFunctionMapper}
                > {item.label}</ItemComponent>
              </Grid>
            )
          }
        })}
      </Grid>
    </Grid>
  )
}