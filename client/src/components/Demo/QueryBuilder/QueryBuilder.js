import $ from 'jquery';
import _ from 'lodash';
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar, Tabs, Tab, Typography, Box, Grid, Icon, CircularProgress, Card, Button,
  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, InputLabel, MenuItem, FormControl,
  Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
  TableSortLabel, FormControlLabel, Switch, Chip, Divider
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandMore';
import DoneIcon from '@material-ui/icons/Done';
import CodeFlyout from '../CodeFlyout';
import rawSampleCode from '!!raw-loader!./QueryBuilder.js'; // eslint-disable-line import/no-webpack-loader-syntax
import useStyles from './styles.js';
import { ApiHighlight } from '../../Highlights/Highlight';
import { TabPanel, a11yProps, descendingComparator, getComparator, stableSort } from './helpers.js';
import AppContext from '../../../AppContext';
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
  const { togglePayWallModal, show, codeShow } = useContext(AppContext)
  //declare constants

  const classes = useStyles();
  const { staticContent, staticContent: { lookerContent }, staticContent: { type }, activeTabValue, handleTabChange, lookerUser } = props;

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
      setTimeout(() => performLookerApiCalls(lookerContent.queryBody, lookerContent.resultFormat), 100);
    })
    setClientSideCode(rawSampleCode)
  }, [lookerContent, lookerUser])

  const performLookerApiCalls = async (newQuery, resultFormat) => {
    // console.log('performLookerApiCalls')
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

    let taskInterval = setInterval(async () => {
      let lookerCheckTaskResposnse = await fetch('/checkquerytask/' + lookerCreateTaskResponseData.queryTaskId, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      let lookerCheckTaskResponseData = await lookerCheckTaskResposnse.json();
      if (lookerCheckTaskResponseData.queryResults.status === 'complete') {
        clearInterval(taskInterval);
        setApiContent(lookerCheckTaskResponseData.queryResults)
        setServerSideCode(lookerCreateTaskResponseData.code)
      }
    }, 5000)
  }

  return (
    <div className={`${classes.root} ${classes.padding30} demoComponent`}>
      <Grid container
        spacing={3}
        key={validIdHelper(type)} >
        <div className={`${classes.root} ${classes.positionRelative}`}>
          <Grid item sm={12}>
            <FilterBar {...props}
              classes={classes}
              action={performLookerApiCalls}
            />
          </Grid>
          {apiContent.status === 'running' ?
            <Grid item sm={12} >
              <Card className={`${classes.card} ${classes.flexCentered}`} elevation={0}>
                <CircularProgress className={classes.circularProgress} />
              </Card>
            </Grid >
            : apiContent.data && apiContent.data.length ?
              <Box
              >
                <Grid container>
                  {codeShow ? <Grid item sm={6}
                    className={`${classes.positionTopRight}`}
                  >
                    <CodeFlyout {...props}
                      classes={classes}
                      lookerUser={lookerUser} />
                  </Grid> : ''}
                  <Divider className={classes.divider} />
                  <Grid item sm={12}>
                    <Box className={`${classes.w100} ${classes.maxHeight600} ${classes.padding30}`} mt={2}>
                      <EnhancedTable
                        {...props}
                        classes={classes}
                        rows={apiContent.data}
                        lookerContent={lookerContent}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              :
              <Grid item sm={12} >
                <Typography variant="h6" component="h6" className={`${classes.gridTitle} ${classes.textCenter}`}>
                  No results found, try a new query<br />
                </Typography>
              </Grid>
          }
        </div >
      </Grid >
    </div >
  )
}


function FilterBar(props) {
  const { staticContent, staticContent: { lookerContent }, classes, action, lookerUser } = props;
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
      setQueryModified(false)
    }
  }

  // useEffect(() => {
  //   handleQuerySubmit()
  // }, [fieldsChipData, filtersData]);

  const datePermissionMap = {
    'basic': ["1 week", "1 month", "3 months", "6 months"]
  }
  datePermissionMap.advanced = [...datePermissionMap.basic, "1 year"]
  datePermissionMap.premium = [...datePermissionMap.advanced, "before today"]

  useEffect(() => {
    let updatedFiltersData = [...filtersData]
    updatedFiltersData[3].value = "6 months";
    setFilterData(updatedFiltersData)
  }, [lookerUser]);

  return (
    <ExpansionPanel expanded={expanded} onChange={handleExpansionPanel} elevation={0}>
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
              Select Metrics:
      {fieldsChipData.length ?
                fieldsChipData.map((item, index) => {
                  return (
                    item.fieldType === 'measure' ?
                      <Chip
                        key={item.label}
                        // key={prettifyString(item.label.substring(item.label.lastIndexOf('.') + 1, item.label.length))}
                        measurecounter={measureCounter += 1}
                        className={item.selected ? `${classes.orangePrimary} ${classes.m6}` : `${classes.m6}`}
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
              Group By:
                          {fieldsChipData.length ?
                fieldsChipData.map((item, index) => {
                  return (
                    item.fieldType === 'dimension' ?
                      <Chip
                        key={item.label}
                        dimensioncounter={dimensionCounter += 1}
                        className={item.selected ? `${classes.bluePrimary} ${classes.m6}` : `${classes.m6}`}
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

          <Grid item sm={3}>
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
                            value={item.value || '6 months'}
                            onChange={(event) => handleSelectChange(index, event.target.value)}
                          >
                            {lookerUser.user_attributes.permission_level ? datePermissionMap[lookerUser.user_attributes.permission_level].map(item => (
                              <MenuItem key={validIdHelper(item)} value={item}>{_.capitalize(item)}</MenuItem>
                            )) : ''}
                          </Select>
                        </>
                        : ''
                  }
                </FormControl>
              )
            }) : ''}
          </Grid>
          <Grid item sm={9}>
            <br />
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={handleQuerySubmit}
              disabled={queryModified ? false : true}
            >Run Query</Button></Grid>
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
    <div className={classes.root}>
      <ApiHighlight classes={classes} >
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
                          className={lookerContent[0].fieldType[key] === 'dimension' ? classes.blueSecondary : classes.orangeSecondary}
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
      </ApiHighlight>
      <Grid container>
        <Grid item sm={6}>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Compact"
          /></Grid>
        <Grid item sm={6}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          /></Grid>
      </Grid>
      <div className={classes.bottomBarSpacer} />
    </div>
  );
}