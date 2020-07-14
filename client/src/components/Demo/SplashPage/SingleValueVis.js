import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ApiHighlight } from '../../Highlights/Highlight';

import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, CircularProgress, Grid } from '@material-ui/core';
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
    console.log('runInlineQuery');
    let stringifiedQuery = encodeURIComponent(JSON.stringify(lookerContent.inlineQuery))
    let lookerResponse = await fetch(`/runinlinequery/${stringifiedQuery}/${lookerContent.resultFormat}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    let lookerResponseData = await lookerResponse.json();
    dataObjForSparkline.id = validIdHelper(`singleVisValue-${lookerContent.id}`);
    dataObjForSparkline.data = [];

    let dataArrForDataObj = [];
    lookerResponseData.queryResults.map(item => {
      if (item[lookerContent.inlineQuery.fields[0]]
        // && item['order_items.count']['order_items.previous_period']["This Period" ? "This Period" : "Previous Period"]
      ) {
        let thisDataItem = {
          "x": item[lookerContent.inlineQuery.fields[0]].toString(),
          "y": lookerContent.inlineQuery.fields.length > 2 ?
            `${item[lookerContent.inlineQuery.fields[1]][lookerContent.inlineQuery.fields[2]]["This Period"]}` :
            `${item[lookerContent.inlineQuery.fields[1]]}`
        }
        if (thisDataItem.y !== "null") dataArrForDataObj.push(thisDataItem)
      }
    })
    dataObjForSparkline.data = [...dataArrForDataObj]
    setApiContent([...apiContent, dataObjForSparkline])
  }
  return (


    <div
      className={`${classes.maxHeight200} ${classes.textCenter}`}
    >
      {apiContent.length ?
        <div
          style={{ borderLeft: `solid 10px ${lookerContent.visColor || "transparent"}` }}
        >
          <Typography variant="subtitle1" color="secondary">
            {lookerContent.label}
          </Typography>
          <ApiHighlight height={400}>
            <ResponsiveLine
              data={apiContent}
              margin={{ top: 25, right: 25, bottom: 25, left: 25 }}
              xScale={{
                type: 'time',
                format: '%Y-%m-%d',
                precision: 'day',
              }}
              enableGridX={false}
              enableGridY={false}
              yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
              axisBottom={{
                // format: '%m/%d',
                format: () => null
              }}
              axisLeft={{
                format: () => null
              }}
              height={150}
              colors={lookerContent.visColor}
            />
          </ApiHighlight>
        </div>
        :
        " Loading..."
      }
    </div >
  );
}
