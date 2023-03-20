import React, { useState, useEffect, useContext } from 'react';
import { ApiHighlight } from './Accessories/Highlight';
import { Typography, Card, CircularProgress, Grid } from '@material-ui/core';
import { appContextMap } from '../utils/tools';

export function SingleValue({ lookerContentItem, classes }) {
  
  const [apiContent, setApiContent] = useState(undefined);
  const { clientSession, sdk, corsApiCall, isReady } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const { userProfile, lookerUser } = clientSession;

  let dataObjForSparkline = {}

  useEffect(() => {
    if (isReady) {
      let isSubscribed = true
      corsApiCall(runInlineQuery).then(response => {
        if (isSubscribed) {
          setApiContent(response)
        }
      })
      return () => isSubscribed = false
    }
  }, [lookerUser, isReady])

  const runInlineQuery = async () => {
    let { inlineQuery } = lookerContentItem;
    let lookerResponseData = await sdk.ok(sdk.run_inline_query({ result_format: lookerContentItem.resultFormat || 'json', body: inlineQuery }));
    // console.log("Sparkline Res: ", lookerResponseData)
    return lookerResponseData
  }

  const labelText = apiContent && apiContent.data.length ? apiContent.data[0][lookerContentItem.inlineQuery.fields[0]].rendered : "";

  return (
    <Card className={`${classes.padding15} 
    ${classes.overflowHidden} 
    ${classes.lookerCardShadow}
    `}
    >
      <div
        style={{
          height: lookerContentItem.height,
        }}
      >
        {apiContent ?
          <React.Fragment>
            <ApiHighlight height={130} classes={classes} >
              <Grid container className={`${classes.textCenter} `}>
                <Grid item sm={12}>
                  <Typography variant="body2" align="left" color="secondary">
                    {lookerContentItem.label}
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <Typography variant="h6" align="left">
                    <b>{labelText}</b>
                  </Typography>
                </Grid>
              </Grid>
            </ApiHighlight>
          </React.Fragment>
          :
          <Grid item sm={12} className={`${classes.flexCentered} `} style={{ height: lookerContentItem.height }}>
            <CircularProgress className={classes.circularProgress}
              style={{ color: `${lookerContentItem.visColor} ` }} />
          </Grid>
        }
      </div>
    </Card>
  );
}
