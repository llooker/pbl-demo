import React, { useState, useEffect, useContext } from 'react';
import { ApiHighlight } from './Accessories/Highlight';
import { Typography, Card, CircularProgress, Grid, Chip } from '@material-ui/core';
import { ResponsiveLine } from '@nivo/line';
import { validIdHelper, decodeHtml, appContextMap } from '../utils/tools';
import DownArrow from '../images/down_arrow.svg';
import UpArrow from '../images/up_arrow.svg';

export function SparkLine({ lookerContentItem, classes }) {
  // console.log('SparkLine')
  // console.log({ lookerContentItem })
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
          "change": item.change || 0
        }
        if (thisDataItem && thisDataItem.y !== "null") dataArrForDataObj.push(thisDataItem)
      }
    })
    dataObjForSparkline.data = [...dataArrForDataObj]

    //setApiContent([dataObjForSparkline])
    return [dataObjForSparkline]
  }
  // console.log({ apiContent })
  const changePercentage = apiContent && apiContent.length
    ? parseInt(apiContent[0].data[0].change * 100).toFixed(0)
    : 0;

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
    <Card className={`${classes.padding15} ${classes.overflowHidden} `}
      elevation={0}
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
                <Grid item sm={8}>
                  <Typography
                    variant="body2"
                    align="left"
                    style={{ minHeight: '2.8em', lineHeight: 1.2, textTransform: 'uppercase' }}
                  >
                    <b>{lookerContentItem.label}</b>
                  </Typography>
                  <Typography
                    variant="body1"
                    align="left"
                    style={{ fontSize: '2em', fontWeight: 300 }}
                  >
                    {labelText}
                  </Typography>
                </Grid>
                <Grid item sm={4}>
                  <div className={classes.positionRelative}>
                    <img
                      src={(changePercentage >= 0) ? UpArrow : DownArrow}
                      style={{ maxWidth: '100%', width: '70px' }}
                    />
                    <Typography
                      variant="subtitle1"
                      align="center"
                      style={{
                        color: 'white',
                        left: 0,
                        position: 'absolute',
                        top: (changePercentage >= 0) ? '18%' : '40%',
                        width: '100%',
                      }}
                    >
                      {`${Math.abs(changePercentage)}%`}
                    </Typography>
                  </div>
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