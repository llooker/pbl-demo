import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../contexts/AppContext';
import { ApiHighlight } from '../../Highlights/Highlight'; //ooops
import { Typography, Grid, Chip } from '@material-ui/core';
const { validIdHelper, decodeHtml } = require('../../../tools');

export function NaturalLanguage({ lookerContent, inlineQuery, index, classes }) {

  const [apiContent, setApiContent] = useState(undefined);
  const { clientSession, sdk, corsApiCall } = useContext(AppContext);
  const { userProfile, lookerUser } = clientSession;

  useEffect(() => {
    let isSubscribed = true
    corsApiCall(runInlineQuery).then(response => {
      if (isSubscribed) {
        setApiContent(response)
      }
    })
    return () => isSubscribed = false
  }, [inlineQuery, lookerUser]);

  const runInlineQuery = async () => {
    // setApiContent(undefined)
    let clientLookerResponse = await sdk.ok(sdk.run_inline_query({ result_format: lookerContent.resultFormat || 'json', body: inlineQuery }));
    return clientLookerResponse[0];
  }

  const upOrDownArrow = apiContent ? apiContent.change > 0 ? `&uarr;` : `&darr;` : '';

  return (
    <Grid item sm={12}>
      {apiContent ?
        <React.Fragment >
          <ApiHighlight classes={classes} >
            <Typography variant="subtitle1" display="inline">
              Your {lookerContent.inlineQueriesMap[index]} category, <b>{apiContent['products.category']}</b>, is {apiContent.change > 0 ? 'up ' : 'down '}
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

        // <Grid item sm={12} >
        //   <Card className={`${classes.card} ${classes.flexCentered}`}>
        //     <CircularProgress className={classes.circularProgress}
        //       style={{ color: `${lookerContent.visColor} ` }} />
        //   </Card>
        // </Grid>
      }
    </Grid >
  );
}

