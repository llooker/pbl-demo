import React, { useState, useEffect, useContext } from 'react';
import { ApiHighlight } from './Accessories/Highlight';
import { Typography, Card, CircularProgress, Grid, Chip } from '@material-ui/core';
import { ResponsiveLine } from '@nivo/line';
import { validIdHelper, decodeHtml, appContextMap } from '../utils/tools';

export function SparkLine({ lookerContentItem, classes }) {
  // console.log('SparkLine')
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

    // setApiContent(undefined)
    let { inlineQuery } = lookerContentItem;
    let lookerResponseData = await sdk.ok(sdk.run_inline_query({ result_format: lookerContentItem.resultFormat || 'json', body: inlineQuery }));
    dataObjForSparkline.id = validIdHelper(`singleVisValue-${lookerContentItem.id}`);
    dataObjForSparkline.data = [];

    let dataArrForDataObj = [];
    lookerResponseData.map(item => {
      if (item[lookerContentItem.inlineQuery.fields[0]]
        // && item['order_items.count']['order_items.previous_period']["This Period" ? "This Period" : "Previous Period"]
      ) {
        let thisDataItem = {
          "x": item[lookerContentItem.inlineQuery.fields[0]].toString(),
          "y": item[lookerContentItem.inlineQuery.fields[1]] || 0,
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
  /**
   * TO DO
   * convert to using rendered value the way single value does
   */
  const labelText = !apiContent ? '' : lookerContentItem.chipFormat === "revenue" ?
    `$${(apiContent[0].data && apiContent[0].data[0] ? apiContent[0].data[0].y.toFixed(2) : '').replace(/\d(?=(\d{3})+\.)/g, '$&,')}` :
    lookerContentItem.chipFormat === "integer" ? parseInt(apiContent[0].data && apiContent[0].data[0] ? apiContent[0].data[0].y.toFixed(2) : '') : lookerContentItem.chipFormat === 'percent' ?
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
                margin={{ top: 10, right: 25, bottom: 50, left: 25 }}
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
                }}
                enablePoints={false}
                enableGridX={false}
                enableGridY={false}
                height={100}
                colors={lookerContentItem.visColor}
                animate={true}
              />
            </ApiHighlight>
          </React.Fragment>
          :
          <Grid item sm={12} className={`${classes.flexCentered} `} style={{ height: lookerContentItem.height }}>
            <CircularProgress className={classes.circularProgress}
              style={{ color: `${lookerContentItem.visColor} ` }} />
          </Grid>
        }
      </div >
    </Card >
  );
}