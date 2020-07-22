import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import {
  AppBar, Tabs, Tab, Typography, Box, Grid, CircularProgress, Card, TextField,
  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Divider, InputLabel, MenuItem,
  FormControl, Select, Modal
} from '@material-ui/core'
import { Skeleton } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ModalTable from '../../Material/ModalTable';
import { ResponsiveCalendar } from '@nivo/calendar'
import CodeFlyout from '../CodeFlyout';
import rawSampleCode from '!!raw-loader!./CustomVis.js'; // eslint-disable-line import/no-webpack-loader-syntax
import useStyles from './styles.js';
import { TabPanel, a11yProps } from './helpers.js';
import { ApiHighlight } from '../../Highlights/Highlight';

//new date pickers
import { format, endOfDay, addDays } from 'date-fns';
// import React from 'react';
// import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import AppContext from '../../../AppContext';
const { validIdHelper } = require('../../../tools');

//start of Custom Viz Calendar Component
export default function CustomVis(props) {
  console.log('CustomVis')
  //initialize state using hooks
  const [value, setValue] = useState(0);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [category, setCategory] = useState('All')
  const [desiredField, setDesiredField] = useState('')
  const [apiContent, setApiContent] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [modalContent, setModalContent] = useState({});
  const [clientSideCode, setClientSideCode] = useState('');
  const [serverSideCode, setServerSideCode] = useState('');

  const { toggleShowPayWallModal } = useContext(AppContext)

  //declare constants
  const classes = useStyles();
  const { staticContent, staticContent: { lookerContent }, staticContent: { type }, activeTabValue, handleTabChange, lookerUser, lookerHost } = props;
  const codeTab = {
    type: 'code flyout', label: 'Code', id: 'codeFlyout',
    lookerContent, lookerUser, clientSideCode, serverSideCode
  }
  const tabContent = [...lookerContent, codeTab]
  const demoComponentType = type || 'code flyout';

  //handle opening of modal for advanced and premium users
  const handleModalOpen = async ({ day }) => {
    let originalInlineQueryCopy = lookerContent[0].inlineQuery
    originalInlineQueryCopy.filters = {
      ...originalInlineQueryCopy.filters,
      [originalInlineQueryCopy.fields[0]]: day,
      [originalInlineQueryCopy.fields[1]]: category === "All" ? '' : category
    }
    originalInlineQueryCopy.total = true;
    originalInlineQueryCopy.limit = "25";

    setOpen(true);
    let lookerResponse = await fetch('/runinlinequery/' + encodeURIComponent(JSON.stringify(originalInlineQueryCopy)) + '/json', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    let lookerResponseData = await lookerResponse.json();
    console.log('lookerResponseData', lookerResponseData)
    let modalObj = {
      "title": `Detail View for ${day}`,
      "body": lookerResponseData.queryResults
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
  if (apiContent.queryResults && apiContent.queryResults) {
    //filtering for fromDate, toDate and category
    filterData = _.filter(apiContent.queryResults, (row) => {
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

  /**
   * listen for lookerContent and call 
   * performLookerApiCalls and setSampleCode
  */
  useEffect(() => {
    if (lookerContent.length) {
      setTimeout(() => performLookerApiCalls(lookerContent), 100);
      setDesiredField(lookerContent[0].desiredFields[0])
      setClientSideCode(rawSampleCode)
    }
  }, [lookerContent, lookerUser])

  /** 
   * What this function does:
   * iterate over Looker Content array referenced above and
   * calls specific endpoints and methods available from Looker Node SDK
   * and embed SDK to create the experience on this page
   */
  const performLookerApiCalls = function (lookerContent) {
    setApiContent([]); //set to empty array to show progress bar and skeleton
    lookerContent.map(async lookerContent => {
      let inlineQuery = lookerContent.inlineQuery;
      inlineQuery.filters = {
        // ...inlineQuery.filters,
        // [Object.keys(inlineQuery.filters)[0]]: lookerUser.user_attributes.time_horizon,
        [lookerContent.desiredFilterName]: lookerUser.user_attributes.brand
      };
      let stringifiedQuery = encodeURIComponent(JSON.stringify(inlineQuery))
      let lookerResponse = await fetch(`/runinlinequery/${stringifiedQuery}/${lookerContent.resultFormat}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      let lookerResponseData = await lookerResponse.json();
      lookerResponseData.queryResults = lookerResponseData.queryResults.filter(item => {
        return item[inlineQuery.fields[0]]
      })
      let uniqueCategories = ['All'];
      for (let i = 0; i < lookerResponseData.queryResults.length; i++) {
        if (uniqueCategories.indexOf(lookerResponseData.queryResults[i][inlineQuery.fields[1]]) === -1) {
          uniqueCategories.push(lookerResponseData.queryResults[i][inlineQuery.fields[1]])
        }
      }
      lookerResponseData.inlineQuery = inlineQuery;
      lookerResponseData.uniqueCategories = uniqueCategories;
      setFromDate(lookerResponseData.queryResults[lookerResponseData.queryResults.length - 1][lookerResponseData.inlineQuery.fields[0]]);
      setToDate(incrementDate(lookerResponseData.queryResults[0][lookerResponseData.inlineQuery.fields[0]], 1));
      setApiContent(lookerResponseData)
      if (serverSideCode.length === 0) setServerSideCode(lookerResponseData.code);
    })
  }

  let redToBlueColorScale = ['#0302FC', '#2A00D5', '#63009E', '#A1015D', '#D80027', '#FE0002'];
  let yellowToGreenColorScale = ['#FEFE69', '#DDF969', '#A9F36A', '#A1015D', '#78EC6C', '#57E86B'];
  return (
    <div className={`${classes.root} demoComponent`}>
      <Grid container
        spacing={3}
        key={validIdHelper(type)} >
        <div className={classes.root}>
          <Box>
            <AppBar position="static">
              <Tabs
                className={classes.tabs}
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example">
                {tabContent.map((item, index) => (
                  <Tab
                    key={`${validIdHelper(demoComponentType + '-tab-' + index)}`}
                    label={item.label}
                    className={item.type === 'code flyout' ? `${classes.mlAuto}` : ``}
                    {...a11yProps(index)} />
                ))}
              </Tabs>
            </AppBar>
            <Box className="tabPanelContainer">
              {tabContent.map((tabContentItem, index) => (
                <TabPanel
                  key={`${validIdHelper(demoComponentType + '-tabPanel-' + index)}`}
                  value={value}
                  index={index}>
                  <Grid container>
                    {tabContentItem.type === 'code flyout' ?

                      <CodeFlyout {...props}
                        classes={classes}
                        lookerContent={lookerContent}
                        clientSideCode={clientSideCode}
                        serverSideCode={serverSideCode}
                        lookerUser={lookerUser} />
                      :
                      <React.Fragment
                        key={`${validIdHelper(demoComponentType + '-innerFragment-' + index)}`}>

                        {!apiContent.queryResults ?
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
                        <Divider className={classes.divider} />
                        <Box
                          className={classes.w100}
                          mt={2}>
                          {!apiContent.queryResults ?

                            <Grid item sm={12} >
                              <Card className={`${classes.card} ${classes.flexCentered}`}>
                                <CircularProgress className={classes.circularProgress} />
                              </Card>
                            </Grid>

                            : apiContent.queryResults && apiContent.queryResults.length ?
                              <>
                                <Grid item sm={12} className={classes.height800}>
                                  <ApiHighlight height={400}>
                                    <ResponsiveCalendar
                                      data={filterData}
                                      align="top"
                                      from={incrementDate(fromDate, 1)}
                                      to={incrementDate(toDate, 1)}
                                      emptyColor="#eeeeee"
                                      // colors={['#0302FC', '#2A00D5', '#63009E', '#A1015D', '#D80027', '#FE0002']}
                                      colors={desiredField === lookerContent[0].desiredFields[0] ? redToBlueColorScale : yellowToGreenColorScale}
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
                                        } else if (lookerUser.permission_level === 'basic') {
                                          toggleShowPayWallModal();
                                        } else {
                                          handleModalOpen(day)
                                          event.stopPropagation();
                                        }
                                      }}
                                    />
                                  </ApiHighlight>
                                </Grid>
                              </> :
                              ''
                          }
                        </Box>
                      </React.Fragment>
                    }
                  </Grid>
                </TabPanel>
              ))}

            </Box>
          </Box >
        </div>
      </Grid >
      {open ?
        <ModalTable
          {...props}
          open={open}
          onClose={handleModalClose}
          classes={classes}
          modalContent={modalContent}
        />

        : ''}
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
    <ExpansionPanel expanded={expanded} onChange={handleExpansionPanel} className={classes.w100}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.heading}>Filter Data</Typography>

      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container spacing={3}>
          {apiContent.queryResults ?
            <>
              <Grid item sm={3}>
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
              </Grid>
              <Grid item sm={3}>
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
              </Grid>

              <Grid item sm={3}>
                {/* <form className={classes.container} >
                  <TextField
                    id="fromDate"
                    label="From date"
                    type="date"
                    value={fromDate}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(event) => handleFromDate(event.target.value)}
                  />
                </form> */}
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
                  />
                </MuiPickersUtilsProvider>

              </Grid>
              <Grid item sm={3}>
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
                  />
                </MuiPickersUtilsProvider>
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