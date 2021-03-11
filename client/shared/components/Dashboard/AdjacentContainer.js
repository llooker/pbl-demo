import _ from 'lodash'
import React from 'react';
import { Grid, List, Box } from '@material-ui/core'
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


  let ContainerComponent = container.component || null;
  // console.log({ ContainerComponent })
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


      <Box style={makeShiftDrawerOpen ? { display: "block" } : { display: "none" }}>
        {container.items.map((item, index) => {
          let ItemComponent = item.component;
          console.log({ ItemComponent })
          console.log({ apiContent })
          //api driven content
          if (apiContent && apiContent[item.apiKey]) {
            console.log({ apiContent })
            return (
              <ContainerComponent
                key={validIdHelper(`ContainerComponent-${item.apiKey}-${index}`)}
                id={validIdHelper(`ContainerComponent-${item.apiKey}-${index}`)}
              >
                {
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
                }
              </ContainerComponent>
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
                > {item.label}</ItemComponent>
              </Grid>
            )
          }
        })}
      </Box>
    </Grid>
  )
}