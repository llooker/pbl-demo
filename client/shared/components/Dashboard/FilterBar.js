import _ from 'lodash'
import React, { useState, useContext } from 'react';
import { Grid, Box } from '@material-ui/core'
import { ChevronLeft, Menu } from '@material-ui/icons';
import { FilterBarChildren } from './FilterBarChildren'
import { appContextMap, validIdHelper } from '../../utils/tools';

export default function FilterBar(props) {
  // console.log("FilterBar")

  const { theme } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);

  const { staticContent: { lookerContent }, staticContent: { type }, classes, apiContent, customFilterAction,
    makeShiftDrawerOpen, setMakeShiftDrawerOpen, helperFunctionMapper, lightThemeToggleValue, fontThemeSelectValue } = props;

  // console.log({ apiContent })
  return (
    <Grid item
      sm={makeShiftDrawerOpen ? lookerContent[0].filterBarWidth ? lookerContent[0].filterBarWidth : 3 : "auto"}
      key={validIdHelper(`${type}-FilterBar-${lookerContent[0].id}`)}
      style={{
        transition: theme.transitions.create("all", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        })
      }}
      className={classes.animatedGridItem}
    >
      {apiContent ?

        <>
          {
            makeShiftDrawerOpen ?
              <ChevronLeft
                onClick={() => setMakeShiftDrawerOpen(!makeShiftDrawerOpen)}
                aria-label="close menu"
              /> :
              <Menu
                onClick={() => setMakeShiftDrawerOpen(!makeShiftDrawerOpen)}
                aria-label="open menu"
              />
          }

          <Box display={makeShiftDrawerOpen ? "block" : "none"}>
            <FilterBarChildren {...props}
              classes={classes}
              apiContent={apiContent}
              customFilterAction={customFilterAction}
              lookerContent={lookerContent}
              type={type}
              helperFunctionMapper={helperFunctionMapper}
              lightThemeToggleValue={lightThemeToggleValue}
              fontThemeSelectValue={fontThemeSelectValue}
            />
          </Box>
        </>

        :
        ""
      }
    </Grid >
  )
}