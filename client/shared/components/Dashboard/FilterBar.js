import _ from 'lodash'
import React, { useState, useEffect } from 'react';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Box } from '@material-ui/core'
import { ExpandMore, VerticalSplit, HorizontalSplit, ChevronLeft, Menu } from '@material-ui/icons';
import { FilterBarChildren } from './FilterBarChildren'
import { validIdHelper } from '../../utils/tools';

export default function FilterBar(props) {
  const { staticContent: { lookerContent }, staticContent: { type }, classes, apiContent, customFilterAction, horizontalLayout, setHorizontalLayout, drawerOpen, setDrawerOpen, helperFunctionMapper, lightThemeToggleValue, fontThemeSelectValue } = props;
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!expanded) setExpanded(true)
  }, [horizontalLayout])


  return (
    <Grid item
      sm={horizontalLayout ? 12 : drawerOpen ? 3 : 'auto'}
      key={validIdHelper(`${type}-FilterBar-${lookerContent[0].id}`)}>
      {apiContent ?
        <Accordion
          onChange={horizontalLayout ? () => setExpanded(!expanded) : () => { }}
          expanded={expanded}
          className={`${classes.w100} MuiExpansionPanel-root`}
          elevation={0}
        >
          <AccordionSummary
            expandIcon={horizontalLayout ? <ExpandMore /> : ""}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            {horizontalLayout ?
              <VerticalSplit
                onClick={(e) => {
                  setHorizontalLayout(!horizontalLayout)
                }}
                aria-label="vertical view"
              />
              :
              <>
                {drawerOpen ?
                  <>
                    <ChevronLeft
                      onClick={() => setDrawerOpen(!drawerOpen)}
                      aria-label="close menu"
                    />
                    <HorizontalSplit
                      onClick={(e) => {
                        setExpanded(true)
                        setHorizontalLayout(!horizontalLayout)
                      }}
                      aria-label="horizontal view" />
                  </> :
                  <Menu
                    onClick={() => setDrawerOpen(!drawerOpen)}
                    aria-label="open menu"
                  />}
              </>}

          </AccordionSummary>
          <Box display={drawerOpen ? "block" : "none"}>
            <AccordionDetails >
              <FilterBarChildren {...props}
                classes={classes}
                apiContent={apiContent}
                customFilterAction={customFilterAction}
                horizontalLayout={horizontalLayout}
                setHorizontalLayout={setHorizontalLayout}
                lookerContent={lookerContent}
                type={type}
                helperFunctionMapper={helperFunctionMapper}
                lightThemeToggleValue={lightThemeToggleValue}
                fontThemeSelectValue={fontThemeSelectValue}
              />
            </AccordionDetails>
          </Box>

        </Accordion >
        :
        ""
      }
    </Grid>
  )
}