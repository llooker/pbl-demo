import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';
import AppContext from '../../../AppContext';
import { ApiHighlight } from '../../Highlights/Highlight';
import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, CircularProgress, Grid, Chip } from '@material-ui/core';
import { ResponsiveLine } from '@nivo/line';
const { validIdHelper, decodeHtml } = require('../../../tools');



export function SingleValueVis({ lookerContent, classes }) {
  // console.log('SingleValueVis')
  // console.log('lookerContent', lookerContent)

  const [apiContent, setApiContent] = useState(undefined);
  const { userProfile, lookerUser, show, sdk, corsApiCall } = useContext(AppContext);

  let dataObjForSparkline = {}

  useEffect(() => {
    let isSubscribed = true
    corsApiCall(runInlineQuery).then(response => {
      if (isSubscribed) {
        setApiContent(response)
      }
    })
    return () => isSubscribed = false
  }, [lookerContent, lookerUser]);

  const runInlineQuery = async () => {

    setApiContent(undefined)
    let { inlineQuery } = lookerContent;
    let lookerResponseData = await sdk.ok(sdk.run_inline_query({ result_format: lookerContent.result_format || 'json', body: inlineQuery }));
    dataObjForSparkline.id = validIdHelper(`singleVisValue-${lookerContent.id}`);
    dataObjForSparkline.data = [];

    let dataArrForDataObj = [];
    lookerResponseData.map(item => {
      if (item[lookerContent.inlineQuery.fields[0]]
        // && item['order_items.count']['order_items.previous_period']["This Period" ? "This Period" : "Previous Period"]
      ) {
        let thisDataItem = {
          "x": item[lookerContent.inlineQuery.fields[0]].toString(),
          "y": item[lookerContent.inlineQuery.fields[1]] || 0,
          "change": item.change
        }
        if (thisDataItem && thisDataItem.y !== "null") dataArrForDataObj.push(thisDataItem)
      }
    })
    dataObjForSparkline.data = [...dataArrForDataObj]
    //setApiContent([dataObjForSparkline])
    return [dataObjForSparkline]
  }

  const upOrDownArrow = apiContent && apiContent.length ? isNaN((apiContent[0].data[0].change * 100).toFixed(2)) ? '' : parseInt((apiContent[0].data[0].change * 100).toFixed(0)) >= 0 ? `&uarr;` : `&darr;` : '';
  const labelText = !apiContent ? '' : lookerContent.chipFormat === "revenue" ?
    `$${(apiContent[0].data && apiContent[0].data[0] ? apiContent[0].data[0].y.toFixed(2) : '').replace(/\d(?=(\d{3})+\.)/g, '$&,')}` :
    lookerContent.chipFormat === "integer" ? parseInt(apiContent[0].data && apiContent[0].data[0] ? apiContent[0].data[0].y.toFixed(2) : '') : lookerContent.chipFormat === 'percent' ?
      `${((apiContent[0].data && apiContent[0].data[0] ? apiContent[0].data[0].y.toFixed(2) : '') * 100)
      }% `
      : '';
  return (
    <Card className={`${classes.padding15} 
    ${classes.overflowHidden} 
    ${classes.lookerCardShadow}
    `}
    >
      <div
        style={{
          height: lookerContent.height,
        }}
      >
        {apiContent ?
          <React.Fragment>
            <ApiHighlight height={130} classes={classes} >
              <Grid container className={`${classes.textCenter} `}>
                <Grid item sm={12}>
                  <Typography variant="body2" align="left" color="secondary">
                    {lookerContent.label}
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <Typography variant="subtitle1" align="left">
                    <b>{labelText}</b>
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <Chip size="small"
                    label={`${decodeHtml(upOrDownArrow)} ${parseInt(apiContent[0].data[0].change * 100).toFixed(0)}% `}
                    className={isNaN((apiContent[0].data[0].change * 100).toFixed(2)) ? '' : parseInt((apiContent[0].data[0].change * 100).toFixed(0)) >= 0 ? classes.greenPos : classes.redNeg}
                    display="inline"
                    align="right"
                  />
                </Grid>
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
                  // legend: lookerContent.label,
                  // legendOffset: 15,
                  // legendPosition: 'middle'
                }}
                enablePoints={false}
                enableGridX={false}
                enableGridY={false}
                height={100}
                colors={lookerContent.visColor}
                animate={true}
              />
            </ApiHighlight>
          </React.Fragment>
          :
          <Grid item sm={12} className={`${classes.flexCentered} `} style={{ height: lookerContent.height }}>
            <CircularProgress className={classes.circularProgress}
              style={{ color: `${lookerContent.visColor} ` }} />
          </Grid>
        }
      </div >
    </Card >
  );
}
