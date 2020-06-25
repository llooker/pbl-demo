import _ from 'lodash'
import React, { useState, useEffect } from 'react';
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
const { validIdHelper } = require('../../../tools');

//start of Custom Viz Calendar Component
export default function CustomVis(props) {
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
    setOpen(true);
    //filter api data to match date clicked
    let modalData = _.filter(apiContent.queryResults.data, (row) => {
      return (row[apiContent.inlineQuery.fields[0]].value >= day
        && row[apiContent.inlineQuery.fields[0]].value <= day)
    })
    //from first index of date clicked, assemble query from url associated with JSON detail
    let sharedUrl = modalData[0][desiredField].links[0].url;
    let parsedUrl = new URL(`https://${lookerHost}.looker.com${sharedUrl}`);
    if (parsedUrl.pathname.split('/')[1] === "explore") {
      let filters = parsedUrl.search.match(/(?<=&f\[).+?(?=\])/g);
      let filtersObj = {}
      let categoryField = ''
      filters.forEach(item => {
        if (category === "All" && item.indexOf('category') > -1) {
          //add category as field always
          categoryField = item;
        } else filtersObj[item] = parsedUrl.searchParams.get(`f[${item}]`)
      })
      let fieldsArr = parsedUrl.searchParams.get("fields").split(",");
      fieldsArr.push(categoryField)
      let newQueryParams = {
        model: parsedUrl.pathname.split('/')[2],
        view: parsedUrl.pathname.split('/')[3],
        fields: fieldsArr,
        filters: filtersObj,
        total: true,
        limit: "25"
      }
      let lookerResponse = await fetch('/runinlinequery/' + JSON.stringify(newQueryParams) + '/json', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      let lookerResponseData = await lookerResponse.json();
      let modalObj = {
        "title": `Detail View for ${day}`,
        "body": lookerResponseData.queryResults
      }
      setModalContent(modalObj);
    }
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
    setFromDate(newValue)
  }
  const handleToDate = newValue => {
    setToDate(newValue)
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
  if (apiContent.queryResults) {
    //filtering for fromDate, toDate and category
    filterData = _.filter(apiContent.queryResults.data, (row) => {
      // console.log('row', row)
      return (row[apiContent.inlineQuery.fields[0]].value > fromDate
        && row[apiContent.inlineQuery.fields[0]].value < toDate
        && (category === 'All' ? true : row[apiContent.inlineQuery.fields[1]].value === category))
    })
    //converting filterDAta to desired format for vis
    filterData = filterData.map(item => {
      return {
        'day': item[apiContent.inlineQuery.fields[0]].value,
        'category': item[apiContent.inlineQuery.fields[1]].value,
        'value': item[desiredField].value
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
    performLookerApiCalls(lookerContent);
    setDesiredField(lookerContent[0].desiredFields[0])
    setClientSideCode(rawSampleCode)
  }, [lookerContent])

  /** 
   * What this function does:
   * iterate over Looker Content array referenced above and
   * calls specific endpoints and methods available from Looker Node SDK
   * and embed SDK to create the experience on this page
   */
  const performLookerApiCalls = function (lookerContent) {
    lookerContent.map(async lookerContent => {
      let inlineQuery = lookerContent.inlineQuery;
      inlineQuery.filters = {
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
      lookerResponseData.queryResults.data = lookerResponseData.queryResults.data.filter(item => {
        return item[inlineQuery.fields[0]].value
      })
      let uniqueCategories = ['All'];
      for (let i = 0; i < lookerResponseData.queryResults.data.length; i++) {
        if (uniqueCategories.indexOf(lookerResponseData.queryResults.data[i][inlineQuery.fields[1]].value) === -1) {
          uniqueCategories.push(lookerResponseData.queryResults.data[i][inlineQuery.fields[1]].value)
        }
      }
      lookerResponseData.inlineQuery = inlineQuery;
      lookerResponseData.uniqueCategories = uniqueCategories;
      setApiContent(lookerResponseData)
      setFromDate(lookerResponseData.queryResults.data[lookerResponseData.queryResults.data.length - 1][lookerResponseData.inlineQuery.fields[0]].value);
      setToDate(lookerResponseData.queryResults.data[0][lookerResponseData.inlineQuery.fields[0]].value);
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

                            : apiContent.queryResults.data && apiContent.queryResults.data.length ?
                              <>
                                <Grid item sm={12} className={classes.height800}>
                                  <h1>{desiredField.substring(desiredField.lastIndexOf(".") + 1, desiredField.length).split("_").map(item => item.charAt(0).toUpperCase() + item.substring(1)).join(" ")}</h1>
                                  <ResponsiveCalendar
                                    data={filterData}
                                    from={fromDate}
                                    to={toDate}
                                    // colors={['#0302FC', '#2A00D5', '#63009E', '#A1015D', '#D80027', '#FE0002']}
                                    colors={desiredField === lookerContent[0].desiredFields[0] ? redToBlueColorScale : yellowToGreenColorScale}
                                    yearSpacing={40}
                                    monthBorderColor="#ffffff"
                                    dayBorderWidth={2}
                                    dayBorderColor="#ffffff"
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
                                    height={700}
                                    maxHeight={500}
                                    onClick={lookerUser.permission_level !== 'basic' ? (day, event) => {
                                      handleModalOpen(day)
                                      event.stopPropagation()
                                    } : undefined}
                                  />
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
        // <SimpleModal {...props}
        //     classes={classes}
        //     open={open}
        //     handleModalClose={handleModalClose}
        //     getModalStyle={getModalStyle}
        //     modalContent={modalContent} /> 
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
                <form className={classes.container} noValidate>
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
                </form>
              </Grid>
              <Grid item sm={3}>
                <form className={classes.container} noValidate>
                  <TextField
                    id="toDate"
                    label="To date"
                    type="date"
                    value={toDate}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(event) => handleToDate(event.target.value)}
                  />
                </form>
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
            </>
            : ''}
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel >
  )
}