import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ApiHighlight } from '../../Highlights/Highlight';

import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Grid, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export function NaturalLanguage({ lookerContent, item, index, classes }) {
  const [apiContent, setApiContent] = useState(undefined);

  useEffect(() => {
    if (item) {
      runInlineQuery();
    }
  }, [item])

  const runInlineQuery = async () => {
    console.log('runInlineQuery')
    let inlineQuery = item;
    console.log('inlineQuery', inlineQuery)
    let stringifiedQuery = encodeURIComponent(JSON.stringify(inlineQuery))
    let lookerResponse = await fetch(`/runinlinequery/${stringifiedQuery}/${lookerContent.resultFormat}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    let lookerResponseData = await lookerResponse.json();
    setApiContent(lookerResponseData.queryResults[0])
  }

  console.log('apiContent', apiContent)
  return (
    <Grid item sm={12}>
      {apiContent ?
        <React.Fragment>
          <Typography variant="subtitle1" display="inline">
            Your {lookerContent.inlineQueriesMap[index]} category, <b>{apiContent['products.category']}</b>, is {apiContent.change > 0 ? 'up ' : 'down '}
          </Typography>
          <Typography variant="subtitle1" display="inline" className={apiContent.change > 0 ? classes.greenPos : classes.redNeg}>
            {`${parseInt(apiContent.change * 100).toFixed(0)}% `}
          </Typography>
          <Typography variant="subtitle1" display="inline">
            over the past week.
          </Typography>
        </React.Fragment>
        : 'Loading...'
      }
    </Grid >
  );
}
