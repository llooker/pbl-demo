import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';
import AppContext from '../../../AppContext';
import { ApiHighlight } from '../../Highlights/Highlight';

import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Grid, CircularProgress, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Looker40SDK, DefaultSettings } from "@looker/sdk";
import { PblSessionEmbed } from '../../../LookerHelpers/pblsession'
const { validIdHelper, decodeHtml } = require('../../../tools');


export function NaturalLanguage({ lookerContent, item, index, classes }) {
  const [apiContent, setApiContent] = useState(undefined);
  const { userProfile, lookerUser, show, accessToken, lookerHost } = useContext(AppContext);

  const session = new PblSessionEmbed({
    ...DefaultSettings(),
    base_url: `https://${lookerHost}.looker.com:19999`,
    accessToken
  });

  let sdk = new Looker40SDK(session);

  useEffect(() => {
    let isSubscribed = true
    runInlineQuery().then(response => {
      if (isSubscribed) {
        setApiContent(response)
      }
    })
    return () => isSubscribed = false
  }, [item, lookerUser]);

  const runInlineQuery = async () => {
    setApiContent(undefined)
    let inlineQuery = item;
    let clientLookerResponse = await sdk.ok(sdk.run_inline_query({ result_format: lookerContent.result_format || 'json', body: inlineQuery }));
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

