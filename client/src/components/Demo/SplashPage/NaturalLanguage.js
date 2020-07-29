import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';
import AppContext from '../../../AppContext';
import { ApiHighlight } from '../../Highlights/Highlight';

import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Grid, CircularProgress, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
const { validIdHelper, decodeHtml } = require('../../../tools');

export function NaturalLanguage({ lookerContent, item, index, classes }) {
  const [apiContent, setApiContent] = useState(undefined);
  const { userProfile, lookerUser } = useContext(AppContext)

  useEffect(() => {
    if (item) {
      runInlineQuery();
    }
  }, [item, lookerUser])

  const runInlineQuery = async () => {
    setApiContent(undefined)
    let inlineQuery = item;
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

  const upOrDownArrow = apiContent ? apiContent.change > 0 ? `&uarr;` : `&darr;` : '';

  return (
    <Grid item sm={12}>
      {apiContent ?
        <ApiHighlight>
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

