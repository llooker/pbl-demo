import $ from 'jquery';
import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import {
  AppBar, Tabs, Tab, Typography, Box, Grid, CircularProgress, Card, TextField,
  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Divider, InputLabel, MenuItem,
  FormControl, Select, Modal
} from '@material-ui/core'
import { Skeleton } from '@material-ui/lab';
import { ExpandMore, FilterList } from '@material-ui/icons';
import ModalTable from '../../Material/ModalTable';
import { ResponsiveCalendar } from '@nivo/calendar'
import CodeFlyout from '../CodeFlyout';
import rawSampleCode from '!!raw-loader!./CustomVis.js'; // eslint-disable-line import/no-webpack-loader-syntax
import useStyles from './styles.js';
import { format, endOfDay, addDays } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import AppContext from '../../../contexts/AppContext';
import { Loader, ApiHighlight } from "@pbl-demo/components";


const { validIdHelper } = require('../../../tools');

export default function CustomVis(props) {
  // console.log('CustomVis')
  const { clientSession, setPaywallModal, show, codeShow, sdk, corsApiCall, isReady } = useContext(AppContext)
  const { userProfile, lookerUser, lookerHost } = clientSession

  const topBarBottomBarHeight = 112;
  const [value, setValue] = useState(0);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [category, setCategory] = useState('All')
  const [desiredField, setDesiredField] = useState('')
  const [apiContent, setApiContent] = useState(undefined);
  const [open, setOpen] = React.useState(false);
  const [modalContent, setModalContent] = useState({});
  const [clientSideCode, setClientSideCode] = useState('');
  const [height, setHeight] = useState((window.innerHeight - topBarBottomBarHeight));
  const [expansionPanelHeight, setExpansionPanelHeight] = useState(0);



  //declare constants
  const classes = useStyles();
  const { staticContent, staticContent: { lookerContent }, staticContent: { type }, activeTabValue, handleTabChange,
    //lookerUser, lookerHost 
  } = props;

  //handle opening of modal for advanced and premium users
  const handleModalOpen = async ({ day }) => {
    let originalInlineQueryCopy = JSON.parse(JSON.stringify(lookerContent[0].inlineQuery));
    originalInlineQueryCopy.filters = {
      ...originalInlineQueryCopy.filters,
      [originalInlineQueryCopy.fields[0]]: day,
      [originalInlineQueryCopy.fields[1]]: category === "All" ? '' : category
    }
    originalInlineQueryCopy.total = true;
    originalInlineQueryCopy.limit = "25";

    setOpen(true);
    let lookerResponseData = await sdk.ok(sdk.run_inline_query({ result_format: lookerContent.result_format || 'json', body: originalInlineQueryCopy }));
    let modalObj = {
      "title": `Detail View for ${day}`,
      "body": lookerResponseData
    }
    setModalContent(modalObj);
  };

  //handle modal close
  const handleModalClose = () => {
    setModalContent({})
    setOpen(false);
  };

  //handle tab change
  const handleChange = (event, newValue) => {
    handleTabChange(0);
    setValue(newValue);
  };

  const handleFromDate = newValue => {
    let validDate = Date.parse(newValue);
    if (validDate > 0) {
      let newValueAsDate = format(addDays(new Date(newValue), 1), 'yyyy-MM-dd');
      setFromDate(newValueAsDate);
    }
  }
  const handleToDate = newValue => {
    let validDate = Date.parse(newValue);
    if (validDate > 0) {
      let newValueAsDate = format(addDays(new Date(newValue), 1), 'yyyy-MM-dd');
      setToDate(newValueAsDate);
    }
  }

  const handleCategory = newValue => {
    setCategory(newValue)
  }

  const handleDesiredField = newValue => {
    setDesiredField(newValue)
  }

  //format response from initial api call based on LookerContent array
  //to match format required by Nivo Calendar component
  let filterData = [];
  if (apiContent) {
    //filtering for fromDate, toDate and category
    filterData = _.filter(apiContent, (row) => {
      return (row[apiContent.inlineQuery.fields[0]] >= fromDate
        && row[apiContent.inlineQuery.fields[0]] < toDate
        && (category === 'All' ? true : row[apiContent.inlineQuery.fields[1]] === category)
      )
    })
    //converting filterDAta to desired format for vis
    filterData = filterData.map(item => {
      return {
        'day': item[apiContent.inlineQuery.fields[0]],
        'category': item[apiContent.inlineQuery.fields[1]],
        'value': item[desiredField]
      }
    })

    //special exception for category all
    //need to reduce array by day across categories
    //destructuing in reduce of value would not work for dynamic var
    if (category === 'All') {
      //create array of all unique dates
      const uniqueDates = [...new Set(filterData.map(item => item.day))];
      let filteredAndReducedForAll = []
      //iterate over unique date
      uniqueDates.map(uniqueDate => {
        //filter filterData for current unique date
        let value = _.filter(filterData, row => {
          return row.day === uniqueDate
        }).reduce((acc, { value }) => acc + value, 0)
        let thisObj = {
          day: uniqueDate,
          value: value,
          category: 'All'
        }
        filteredAndReducedForAll.push(thisObj)

      })
      filterData = filteredAndReducedForAll;
    }
  }

  useEffect(() => {
    if (isReady) {
      corsApiCall(performLookerApiCalls, [lookerContent])
      setDesiredField(lookerContent[0].desiredFields[0])
      setClientSideCode(rawSampleCode)
    }
  }, [lookerUser, isReady])

  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - topBarBottomBarHeight)));
    setExpansionPanelHeight($('.MuiExpansionPanel-root:visible').innerHeight() || 0)

  })

  const performLookerApiCalls = function (lookerContent) {
    // console.log('performLookerApiCalls')
    // console.log({ lookerContent })

    setApiContent(undefined); //set to empty array to show progress bar and skeleton
    lookerContent.map(async lookerContent => {
      let { inlineQuery } = lookerContent;
      inlineQuery.filters = {
        [lookerContent.desiredFilterName]: lookerUser.user_attributes.brand
      };
      let lookerResponseData = await sdk.ok(sdk.run_inline_query({ result_format: lookerContent.result_format || 'json', body: inlineQuery }));

      // console.log('lookerResponseData', lookerResponseData)
      lookerResponseData = lookerResponseData.filter(item => {
        return item[inlineQuery.fields[0]]
      })
      let uniqueCategories = ['All'];
      for (let i = 0; i < lookerResponseData.length; i++) {
        if (uniqueCategories.indexOf(lookerResponseData[i][inlineQuery.fields[1]]) === -1) {
          uniqueCategories.push(lookerResponseData[i][inlineQuery.fields[1]])
        }
      }
      lookerResponseData.inlineQuery = inlineQuery;
      lookerResponseData.uniqueCategories = uniqueCategories;
      setFromDate(lookerResponseData[lookerResponseData.length - 1][lookerResponseData.inlineQuery.fields[0]]);
      setToDate(incrementDate(lookerResponseData[0][lookerResponseData.inlineQuery.fields[0]], 1));
      setApiContent(lookerResponseData)
    })
  }

  let nivoColorScale = ['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']
  let googleColorScale = ['#4595EC', '#F3A759', '#E24E3A', '#65AB5A'];

  return (
    <div className={`${classes.root} demoComponent`}
      style={{ height }}>
      <Card elevation={1} className={`
      ${classes.padding30} 
      ${classes.height100Percent}
      ${classes.overflowScroll}`
      }
      >
        <Grid container
          key={validIdHelper(type)} >
          <div className={`${classes.root} `}>

            {!apiContent ?
              <Skeleton variant="rect" animation="wave" className={classes.skeleton} />
              :
              <FilterBar {...props}
                classes={classes}
                apiContent={apiContent}
                fromDate={fromDate}
                toDate={toDate}
                category={category}
                desiredField={desiredField}
                handleFromDate={handleFromDate}
                handleToDate={handleToDate}
                handleCategory={handleCategory}
                handleDesiredField={handleDesiredField}
              />
            }


            {!apiContent ?

              <Loader classes={classes}
                height={height}
                expansionPanelHeight={expansionPanelHeight} />

              : apiContent && apiContent.length ?
                <Box>
                  <Grid container
                    spacing={3}
                    className={`${classes.noContainerScroll}`}>
                    {codeShow ?
                      <Grid item sm={6}
                        className={`${classes.positionFixedTopRight}`}
                      >
                        <CodeFlyout {...props}
                          classes={classes}
                          lookerUser={lookerUser}
                          height={height}
                        />
                      </Grid> : ''}
                    <Divider className={classes.divider} />
                    <Grid item sm={12} >

                      <Box className={`${classes.w100} ${classes.padding10}`} mt={2}>

                        <ApiHighlight height={400} classes={classes}>
                          <ResponsiveCalendar
                            data={filterData}
                            align="top"
                            from={incrementDate(fromDate, 1)}
                            to={incrementDate(toDate, 1)}
                            emptyColor="#eeeeee"
                            colors={desiredField === lookerContent[0].desiredFields[0] ? googleColorScale : nivoColorScale}
                            yearSpacing={40}
                            monthBorderColor="#ffffff"
                            dayBorderWidth={2}
                            dayBorderColor="#ffffff"
                            margin={{ bottom: 40, left: 40 }}
                            legends={[
                              {
                                anchor: 'bottom-right',
                                direction: 'row',
                                translateY: 36,
                                itemCount: 4,
                                itemWidth: 42,
                                itemHeight: 36,
                                itemsSpacing: 14,
                                itemDirection: 'right-to-left'
                              }
                            ]}
                            onClick={(day, event) => {
                              if (!day.value) {
                              } else if (lookerUser.user_attributes.permission_level === 'basic') {
                                setPaywallModal({
                                  'show': true,
                                  'permissionNeeded': 'see_drill_overlay'
                                });
                              } else {
                                corsApiCall(handleModalOpen, [day])
                                event.stopPropagation();
                              }
                            }}
                          />
                        </ApiHighlight>
                      </Box>
                    </Grid>
                  </Grid>
                </Box> :
                ''
            }
          </div>
        </Grid >
        {
          open ?
            <ModalTable
              {...props}
              open={open}
              onClose={handleModalClose}
              classes={classes}
              modalContent={modalContent}
            />

            : ''
        }
      </Card>
    </div >
  )
}
//Filter Bar code
function FilterBar(props) {
  const { staticContent, staticContent: { lookerContent }, staticContent: { type }, classes,
    apiContent, fromDate, toDate, category, desiredField, handleFromDate, handleToDate, handleCategory, handleDesiredField } = props;

  const [expanded, setExpanded] = useState(true);

  const handleExpansionPanel = (event, newValue) => {
    setExpanded(expanded ? false : true);
  };

  // console.log('FilterBar')
  // console.log('fromDate', fromDate)
  // console.log('toDate', toDate)

  return (
    <ExpansionPanel expanded={expanded} onChange={handleExpansionPanel} className={classes.w100} elevation={0}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <FilterList /><Typography className={`${classes.heading} ${classes.ml12}`}>Filter:</Typography>

      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container spacing={3}>
          {apiContent ?
            <>
              <Grid item sm={3}>

                <ApiHighlight classes={classes}>
                  <FormControl className={classes.formControl}>
                    <InputLabel
                      id={`${validIdHelper(type + '-FilterBar-DataPropery-SelectLabel')}`}
                    >
                      Metric</InputLabel>
                    <Select
                      labelId={`${validIdHelper(type + '-FilterBar-DataPropery-SelectLabel')}`}
                      id={`${validIdHelper(type + '-FilterBar-DataPropery-Select')}`}
                      value={desiredField}
                      onChange={(event) => handleDesiredField(event.target.value)}
                    >
                      {lookerContent[0].desiredFields.map((item, index) => (

                        <MenuItem
                          id={validIdHelper(`${item}-${index}`)}
                          key={validIdHelper(`${item}-${index}`)}
                          value={item}
                        >{item.substring(item.lastIndexOf(".") + 1, item.length).split("_").map(item => item.charAt(0).toUpperCase() + item.substring(1)).join(" ")}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ApiHighlight>
              </Grid>
              <Grid item sm={3}>
                <ApiHighlight classes={classes}>
                  <FormControl className={classes.formControl}>
                    <InputLabel
                      id={`${validIdHelper(type + '-FilterBar-Category-SelectLabel')}`}
                    >
                      Category</InputLabel>
                    <Select
                      labelId={`${validIdHelper(type + '-FilterBar-Category-SelectLabel')}`}
                      id={`${validIdHelper(type + '-FilterBar-Category-Select')}`}
                      value={category}
                      onChange={(event) => handleCategory(event.target.value)}
                    >
                      {apiContent.uniqueCategories.map((item, index) => (

                        <MenuItem
                          id={validIdHelper(`${item}-${index}`)}
                          key={validIdHelper(`${item}-${index}`)}
                          value={item}>{item}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ApiHighlight>
              </Grid>

              <Grid item sm={3}>

                <ApiHighlight classes={classes}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="fromDate"
                      label="From date"
                      value={fromDate}
                      onChange={handleFromDate}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      minDate={apiContent[apiContent.length - 1][apiContent.inlineQuery.fields[0]]}
                      maxDate={apiContent[0][apiContent.inlineQuery.fields[0]]}
                    />
                  </MuiPickersUtilsProvider>
                </ApiHighlight>
              </Grid>
              <Grid item sm={3}>
                <ApiHighlight classes={classes}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="toDate"
                      label="To date"
                      value={toDate}
                      onChange={handleToDate}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      minDate={fromDate}
                      maxDate={toDate}
                    />
                  </MuiPickersUtilsProvider>
                </ApiHighlight>
              </Grid>
            </>
            : ''}
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel >
  )
}

function incrementDate(dateInput, increment) {
  var dateFormatTotime = new Date(dateInput);
  var increasedDate = new Date(dateFormatTotime.getTime() + (increment * 86400000));
  return increasedDate.toISOString().split('T')[0];
}