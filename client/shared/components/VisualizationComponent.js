import React, { useState, useEffect, useContext } from 'react';
import { validIdHelper, decodeHtml, appContextMap } from '../utils/tools';
import { Query, Visualization, QueryFormatter, Sparkline } from "@looker/visualizations";
import { VisComponentHightlight } from './Accessories/Highlight';
import { Grid } from '@material-ui/core';

export function VisualizationComponent({ lookerContentItem, classes }) {
  
  const [apiContent, setApiContent] = useState(undefined);
  const { clientSession, sdk, corsApiCall, isReady, theme } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const { userProfile, lookerUser } = clientSession;

  let {qid, id, height, config} = lookerContentItem

console.log({id})

  return (
    <div className={`${classes.padding15} ${classes.overflowHidden} `}>
      <div
        style={{
          height: height,
        }}
      >
        <VisComponentHightlight height={130} classes={classes} >
          <Grid container className={`${classes.textCenter} `}>
            <Grid item sm={8}>
              <Query sdk={sdk} query={id} 
                config={config ? config : {}}
              >
                <Visualization 
                 height={height}
                 />
              </Query>
            </Grid>
            </Grid>
        </VisComponentHightlight>
      </div>
      </div>
  );
};
