import React, { useState, useEffect, useContext } from 'react';
import { Typography, Grid, Chip } from '@material-ui/core';
import { ApiHighlight } from './Accessories/Highlight';
const { validIdHelper, decodeHtml, appContextMap } = require('../utils/tools');


export function NaturalLanguage({ lookerContentItem, inlineQuery, index, classes }) {

  const [apiContent, setApiContent] = useState(undefined);
  const { clientSession, sdk, corsApiCall, isReady } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const { userProfile, lookerUser } = clientSession;

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
    let clientLookerResponse = await sdk.ok(sdk.run_inline_query({ result_format: lookerContentItem.resultFormat || 'json', body: inlineQuery }));
    return clientLookerResponse[0];
  }

  const upOrDownArrow = apiContent ? apiContent.change > 0 ? `&uarr;` : `&darr;` : '';

  return (
    <Grid item sm={12}>
      {apiContent ?
        <React.Fragment >
          <ApiHighlight classes={classes} >
            <Typography variant="subtitle1" display="inline">
              Your {lookerContentItem.inlineQueriesMap[index]} category, <b>{apiContent['products.category']}</b>, is {apiContent.change > 0 ? 'up ' : 'down '}
            </Typography>
            <Chip size="small"
              label={`${decodeHtml(upOrDownArrow)} ${parseInt(apiContent.change * 100).toFixed(0)}% `}
              className={apiContent.change > 0 ? classes.greenPos : classes.redNeg}
              display="inline"
            />
            <Typography variant="subtitle1" display="inline">
              &nbsp;over the past week.
        </Typography>
          </ApiHighlight>
        </React.Fragment>
        : <div style={{ height: '56px' }}></div>
      }
    </Grid >
  );
}

