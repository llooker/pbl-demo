import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar, Tabs, Tab, Typography, Box, Grid, Icon, CircularProgress, Card, Button,
  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, InputLabel, MenuItem, FormControl,
  Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
  TableSortLabel, FormControlLabel, Switch, Chip, Divider
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DoneIcon from '@material-ui/icons/Done';
import CodeFlyout from '../CodeFlyout';
import rawSampleCode from '!!raw-loader!./QueryBuilder.js'; // eslint-disable-line import/no-webpack-loader-syntax
import useStyles from './styles.js';
import { ApiHighlight } from '../../Highlights/Highlight';
import { TabPanel, a11yProps, descendingComparator, getComparator, stableSort } from './helpers.js';
const { validIdHelper, prettifyString } = require('../../../tools');

//start of QueryBuilder Component
export default function QueryBuilder(props) {


  // console.log('QueryBuilder')
  // console.log('props', props)

  //initialize state using hooks
  const [value, setValue] = useState(0);
  const [apiContent, setApiContent] = useState({});
  const [clientSideCode, setClientSideCode] = useState('');
  const [serverSideCode, setServerSideCode] = useState('');
  //declare constants

  const classes = useStyles();
  const { staticContent, staticContent: { lookerContent }, staticContent: { type }, activeTabValue, handleTabChange, lookerUser } = props;
  const codeTab = {
    type: 'code flyout', label: 'Code', id: 'codeFlyout',
    lookerContent, lookerUser, clientSideCode, serverSideCode
  }
  const tabContent = [...lookerContent, codeTab];
  const demoComponentType = type || 'code flyout';

  //handle tab change
  const handleChange = (event, newValue) => {
    handleTabChange(0);
    setValue(newValue);
  };

  /**
   * listen for lookerContent and call 
   * performLookerApiCalls and setSampleCode
  */
  useEffect(() => {
    lookerContent.map(lookerContent => {
      action(lookerContent.queryBody, lookerContent.resultFormat)
    })
    setClientSideCode(rawSampleCode)
  }, [lookerContent])

  const action = async (newQuery, resultFormat) => {
    // console.log('action')
    let apiContentCopy = { ...apiContent }
    apiContentCopy.status = 'running';
    setApiContent(apiContentCopy)

    let lookerCreateTaskResposnse = await fetch('/createquerytask/' + JSON.stringify(newQuery), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    let lookerCreateTaskResponseData = await lookerCreateTaskResposnse.json();
    // setServerSideCode(lookerCreateTaskResponseData.code)

    let taskInterval = setInterval(async () => {
      let lookerCheckTaskResposnse = await fetch('/checkquerytask/' + lookerCreateTaskResponseData.queryTaskId, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      let lookerCheckTaskResponseData = await lookerCheckTaskResposnse.json();
      console.log('lookerCheckTaskResponseData', lookerCheckTaskResponseData)
      if (lookerCheckTaskResponseData.queryResults.status === 'complete') {
        clearInterval(taskInterval);
        setApiContent(lookerCheckTaskResponseData.queryResults)
        setServerSideCode(lookerCreateTaskResponseData.code)
      }
    }, 5000)
  }

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
                        <FilterBar {...props}
                          classes={classes}
                          action={action}
                        />
                        <Divider className={classes.divider} />
                        <Box
                          className={classes.w100}
                          mt={2}>
                          {apiContent.status === 'running' ?
                            <Grid item sm={12} >
                              <Card className={`${classes.card} ${classes.flexCentered}`}>
                                <CircularProgress className={classes.circularProgress} />
                              </Card>
                            </Grid >
                            : apiContent.data && apiContent.data.length ?
                              <Grid item sm={12}>
                                <EnhancedTable
                                  {...props}
                                  classes={classes}
                                  rows={apiContent.data}
                                  lookerContent={lookerContent}
                                />
                              </Grid>
                              :
                              <Grid item sm={12} >
                                <Typography variant="h6" component="h6" className={`${classes.gridTitle} ${classes.textCenter}`}>
                                  No results found, try a new query<br />
                                </Typography>
                              </Grid>
                          }
                        </Box >
                      </React.Fragment >
                    }
                  </Grid >
                </TabPanel >
              ))}
            </Box >
          </Box >
        </div >
      </Grid >
    </div >
  )
}


function FilterBar(props) {
  // console.log('FilterBar')
  // console.log('props', props)
  const { staticContent, staticContent: { lookerContent }, classes, action } = props;
  let measureCounter = 0;
  let dimensionCounter = 0;

  const [expanded, setExpanded] = useState(true);
  const [fieldsChipData, setFieldsChipData] = useState(lookerContent[0].queryBody ? lookerContent[0].queryBody.fields.map((item, index) => {
    return {
      key: 'fieldChipData' + index,
      label: prettifyString(item.substring(item.lastIndexOf('.') + 1, item.length)),
      datalabel: item,
      selected: true,
      fieldType: lookerContent[0].fieldType[item]
    }
  }) : '');
  const [queryModified, setQueryModified] = useState(false);
  const [filtersData, setFilterData] = useState(lookerContent[0].queryBody ? Object.keys(lookerContent[0].queryBody.filters).map((key, index) => {
    return {
      key: 'filter' + index,
      label: key,
      value: lookerContent[0].queryBody.filters[key],
      type: lookerContent[0].filterType[key]
    }
  }) : '')

  const handleExpansionPanel = (event, newValue) => {
    setExpanded(expanded ? false : true);
  };

  const handleFieldChipClick = (chip, index) => {
    let updatedFieldsChipData = [...fieldsChipData]
    updatedFieldsChipData[index].selected = updatedFieldsChipData[index].selected === false ? true : false
    setFieldsChipData(updatedFieldsChipData)
    setQueryModified(true)
  }

  const handleSelectChange = (index, newValue) => {
    let updatedFiltersData = [...filtersData]
    updatedFiltersData[index].value = newValue;
    setFilterData(updatedFiltersData)
    setQueryModified(true)
  }

  const handleQuerySubmit = (event) => {
    if (queryModified) {
      let newFields = fieldsChipData.filter(chip => chip.selected).map(item => item.datalabel);
      let currentFilters = {}; //needs to be object
      filtersData.map((item, index) => {
        currentFilters[item.label] = item.value
      })
      let newQueryObj = lookerContent[0].queryBody;
      newQueryObj.fields = newFields;
      newQueryObj.filters = currentFilters;
      action(newQueryObj, lookerContent[0].resultFormat);
    }
  }

  useEffect(() => {
    handleQuerySubmit()
  }, [fieldsChipData, filtersData]);


  return (
    <ExpansionPanel expanded={expanded} onChange={handleExpansionPanel}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.heading}>Build Query</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container spacing={3}>
          <Grid item sm={12}>
            <Typography variant="subtitle1">
              Select Fields:
      {fieldsChipData.length ?
                fieldsChipData.map((item, index) => {
                  return (
                    item.fieldType === 'measure' ?
                      <Chip
                        key={item.label}
                        // key={prettifyString(item.label.substring(item.label.lastIndexOf('.') + 1, item.label.length))}
                        measurecounter={measureCounter += 1}
                        className={item.selected ? `${classes.orangePrimary}` : ``}
                        label={prettifyString(item.label.substring(item.label.lastIndexOf('.') + 1, item.label.length))}
                        datalabel={item.label}
                        onClick={() => handleFieldChipClick(item, index)}
                        icon={item.selected ? <DoneIcon className={classes.dBlock} /> : <DoneIcon className={classes.dNone} />}
                      /> : ''
                  )
                }) : ''
              }<br />
            </Typography>
          </Grid>
          <Grid item sm={12}>
            <Typography variant="subtitle1">
              Totals:
                          {fieldsChipData.length ?
                fieldsChipData.map((item, index) => {
                  return (
                    item.fieldType === 'dimension' ?
                      <Chip
                        key={item.label}
                        dimensioncounter={dimensionCounter += 1}
                        className={item.selected ? `${classes.greyPrimary}` : ``}
                        label={prettifyString(item.label.substring(item.label.lastIndexOf('.') + 1, item.label.length))}
                        datalabel={item.label}
                        onClick={() => handleFieldChipClick(item, index)}
                        icon={item.selected ? <DoneIcon className={classes.dBlock} /> : <DoneIcon className={classes.dNone} />}
                      /> : ''
                  )
                }) : ''
              }<br />
            </Typography>
          </Grid>

          <Grid item sm={12}>
            <Typography variant="subtitle1">
              Filter By:
                      </Typography>
            {filtersData.length ? filtersData.map((item, index) => {
              return (
                <FormControl className={item.value.length ? classes.formControl : classes.hidden} key={validIdHelper(`${item.label}FormControl`)}>
                  {
                    item.type === 'yesno' ?
                      <>
                        <InputLabel id={validIdHelper(`${item.label}FilterLabel`)}>{prettifyString(item.label.substring(item.label.lastIndexOf('.') + 1, item.label.length))}:</InputLabel>
                        <Select
                          labelId={validIdHelper(`${item.label}FilterLabel`)}
                          id={validIdHelper(`${item.label}FilterSelect`)}
                          value={item.value}
                          onChange={(event) => handleSelectChange(index, event.target.value)}
                        >
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                          <MenuItem value="All">All</MenuItem>
                        </Select>
                      </>
                      : item.type === 'date' ?
                        <>
                          <InputLabel id={validIdHelper(`${item.label}FilterLabel`)}>{prettifyString(item.label.substring(item.label.lastIndexOf('.') + 1, item.label.length))}:</InputLabel>

                          <Select
                            labelId={validIdHelper(`${item.label}FilterLabel`)}
                            id={validIdHelper(`${item.label}FilterSelect`)}
                            value={item.value}
                            onChange={(event) => handleSelectChange(index, event.target.value)}
                          >
                            <MenuItem value="1 week">1 week</MenuItem>
                            <MenuItem value="1 month">1 month</MenuItem>
                            <MenuItem value="3 months">3 months</MenuItem>
                            <MenuItem value="6 months">6 months</MenuItem>
                            <MenuItem value="1 year">1 year</MenuItem>
                          </Select>
                        </>
                        : ''
                  }
                </FormControl>
              )
            }) : ''}
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, rows } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {Object.keys(rows[0]).map((key, index) => (
          <TableCell
            key={validIdHelper(key + '-TableHead-TableCell-' + index)}
            id={validIdHelper(key + '-TableHead-TableCell-' + index)}
            align={key.numeric ? 'right' : 'left'}
            padding={key.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === key ? order : false}
          >
            <TableSortLabel
              active={orderBy === key}
              direction={orderBy === key ? order : 'asc'}
              onClick={createSortHandler(key)}
            >
              {prettifyString(key.substring(key.lastIndexOf('.') + 1, key.length))}
              {orderBy === key ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  // numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  // onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTable(props) {
  const { rows, classes, lookerContent } = props;
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(Object.keys(rows[0])[0]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <ApiHighlight>
      <div className={classes.root}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              {...props}
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />

            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      key={validIdHelper('TableRow-' + index)}
                      id={validIdHelper('TableRow-' + index)}>
                      {Object.keys(row).map((key, index) => (
                        <TableCell
                          key={validIdHelper(key + '-TableBody-TableCell-' + index)}
                          id={validIdHelper(key + '-TableBody-TableCell-' + index)}
                          className={lookerContent[0].fieldType[key] === 'dimension' ? classes.greySecondary : classes.orangeSecondary}
                          align="right">
                          {row[key].rendered ? row[key].rendered : row[key].value}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Compact"
        />
      </div>
    </ApiHighlight>
  );
}