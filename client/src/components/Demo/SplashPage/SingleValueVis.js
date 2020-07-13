import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ApiHighlight } from '../../Highlights/Highlight';

import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ResponsiveLine } from '@nivo/line';
const { validIdHelper } = require('../../../tools');



export function SingleValueVis({ lookerContent, classes, onClick }) {
  // console.log('SingleValueVis')
  // console.log('lookerContent', lookerContent)
  // const [svg, setSvg] = useState(undefined)
  const [apiContent, setApiContent] = useState([]);



  let dataObjForSparkline = {}
  useEffect(() => {
    if (lookerContent) {
      runInlineQuery();
    }
  }, [lookerContent])



  const runInlineQuery = async () => {
    let stringifiedQuery = encodeURIComponent(JSON.stringify(lookerContent.inlineQuery))
    let lookerResponse = await fetch(`/runinlinequery/${stringifiedQuery}/json`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    let lookerResponseData = await lookerResponse.json();
    console.log('lookerResponseData', lookerResponseData)
    dataObjForSparkline.id = validIdHelper(`singleVisValue-${lookerContent.id}`);
    // dataObjForSparkline.color = "hsl(173, 70%, 50%)";
    dataObjForSparkline.data = [];

    let dataArrForDataObj = [];
    lookerResponseData.queryResults.map(item => {
      if (item['order_items.created_date'] &&
        item['order_items.count']['order_items.previous_period']["This Period" ? "This Period" : "Previous Period"]) {
        let thisDataItem = {
          "x": item['order_items.created_date'].toString(),
          "y": item['order_items.count']['order_items.previous_period']["This Period" ? "This Period" : "Previous Period"]
        }
        dataArrForDataObj.push(thisDataItem)
      }
    })
    dataObjForSparkline.data = [...dataArrForDataObj]
    console.log('dataObjForSparkline', dataObjForSparkline)
    setApiContent([...apiContent, dataObjForSparkline])
  }

  console.log('apiContent', apiContent);


  return (


    <div
      onClick={onClick}
      className={`embedContainer ${classes.maxHeight200} ${classes.textCenter} ${classes.cursor} ${classes.height800}`}
    >
      <Typography variant="h5" component="h5" className={classes.gridTitle} align="center">
        {lookerContent.label}
      </Typography>
      <br />
      {apiContent.length ?
        <ApiHighlight height={400}>
          <ResponsiveLine
            data={apiContent}
            xScale={{
              type: 'time',
              format: '%Y-%m-%d',
              precision: 'day',
            }}
            axisBottom={{
              format: '%b %d',
            }}
            colors={{ scheme: 'nivo' }}
          />
        </ApiHighlight>
        : 'f u'}
    </div>
  );
}
