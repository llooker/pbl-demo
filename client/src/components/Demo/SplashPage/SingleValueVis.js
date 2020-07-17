import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ApiHighlight } from '../../Highlights/Highlight';
import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, CircularProgress, Grid } from '@material-ui/core';
import { ResponsiveLine } from '@nivo/line';
const { validIdHelper } = require('../../../tools');



export function SingleValueVis({ lookerContent, classes, onClick, lookerUser }) {
  // console.log('SingleValueVis')
  // console.log('lookerContent', lookerContent)
  // const [svg, setSvg] = useState(undefined)
  const [apiContent, setApiContent] = useState([]);



  let dataObjForSparkline = {}
  useEffect(() => {
    if (lookerContent || lookerUser) {
      runInlineQuery();
    }
  }, [lookerContent, lookerUser])



  const runInlineQuery = async () => {
    setApiContent([])
    let stringifiedQuery = encodeURIComponent(JSON.stringify(lookerContent.inlineQuery))
    let lookerResponse = await fetch(`/runinlinequery/${stringifiedQuery}/${lookerContent.resultFormat}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    let lookerResponseData = await lookerResponse.json();
    // console.log('lookerResponseData', lookerResponseData)
    dataObjForSparkline.id = validIdHelper(`singleVisValue-${lookerContent.id}`);
    dataObjForSparkline.data = [];

    let dataArrForDataObj = [];
    lookerResponseData.queryResults.map(item => {
      if (item[lookerContent.inlineQuery.fields[0]]
        // && item['order_items.count']['order_items.previous_period']["This Period" ? "This Period" : "Previous Period"]
      ) {
        let thisDataItem = {
          "x": item[lookerContent.inlineQuery.fields[0]].toString(),
          "y": item[lookerContent.inlineQuery.fields[1]] || 0,
          "change": item.change
        }
        if (thisDataItem.y !== "null") dataArrForDataObj.push(thisDataItem)
      }
    })
    dataObjForSparkline.data = [...dataArrForDataObj]
    setApiContent([dataObjForSparkline])
  }

  return (

    <div
      className={` ${classes.maxHeight200} ${classes.textCenter}`}
      // className={` ${ classes.textCenter } `}
      style={apiContent.length ? { borderLeft: `solid 3px ${lookerContent.visColor} ` } : {}}
    >
      {apiContent.length ?
        <React.Fragment>
          <ApiHighlight height={140}>
            <Grid container>
              <Grid item sm={1} />
              <Grid item sm={5}>
                <Typography variant="subtitle1" align="left">
                  <b>{apiContent[0].data ? parseInt(apiContent[0].data[0].y).toFixed(2) : ''}</b>
                </Typography>
              </Grid>
              <Grid item sm={5}>
                <Typography variant="subtitle1"
                  className={isNaN((apiContent[0].data[0].change * 100).toFixed(2)) ? '' : parseInt((apiContent[0].data[0].change * 100).toFixed(0)) >= 0 ? classes.greenPos : classes.redNeg}
                  align="right">
                  {apiContent[0].data ? `${parseInt(apiContent[0].data[0].change * 100).toFixed(0)}% ` : ''}
                </Typography>
              </Grid>
              <Grid item sm={1} />


            </Grid>
            <ResponsiveLine
              data={apiContent}
              margin={{ top: 25, right: 25, bottom: 25, left: 25 }}
              xScale={{
                type: 'time',
                format: '%Y-%m-%d',
                precision: 'day',
              }}
              yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
              axisLeft={{
                orient: "left",
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
                format: () => null
              }}
              axisBottom={{
                orient: "bottom",
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
                format: () => null,
                legend: lookerContent.label,
                legendOffset: 15,
                legendPosition: 'middle'
              }}
              enablePoints={false}
              enableGridX={false}
              enableGridY={false}
              height={150}
              colors={lookerContent.visColor}
              animate={true}
            />
          </ApiHighlight>
        </React.Fragment>
        :
        <Grid item sm={12} >
          <Card className={`${classes.card} ${classes.flexCentered} ${classes.minHeight200} `}>
            <CircularProgress className={classes.circularProgress} color={lookerContent.visColor}
              style={{ color: `${lookerContent.visColor} ` }} />
          </Card>
        </Grid>
      }
    </div >
  );
}
