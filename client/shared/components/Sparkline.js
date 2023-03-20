import React, { useContext } from 'react';
import { appContextMap, validIdHelper } from '../utils/tools';
import { VisComponentHightlight } from './Accessories/Highlight';
import { Grid, Typography, Card } from '@material-ui/core';
import {  VisualizationComponent } from '@pbl-demo/components'

export function Sparkline({ lookerContentItem, classes }) {

  const { sdk} = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  let { height, label} = lookerContentItem

  return (
    <Card 
    className={`${classes.padding15} ${classes.overflowHidden} `}
    // elevation={2}
    variant="outlined"
    >
      <div
        style={{
          height: height,
        }}
      >
        <VisComponentHightlight  classes={classes} >
          <Grid container>
            {label ? 
            <Grid item sm={6}>
              <Typography
                variant="body2"
                align="left"
                style={{ minHeight: '2.8em', lineHeight: 1.2, textTransform: 'uppercase' }}
              >
                <b>{label}</b>
              </Typography>
            </Grid>: ""}

            {lookerContentItem.queries.map((item) => {
              return (
                <Grid item sm={item.gridWidth}
                  key={validIdHelper(item.id || item.qid)}
                >
                  <VisualizationComponent item={item} />
                </Grid>
              )
            })}
            </Grid>
        </VisComponentHightlight>
      </div>
      </Card>
  );
}