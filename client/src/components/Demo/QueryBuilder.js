import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import Divider from '@material-ui/core/Divider';
import grey from '@material-ui/core/colors/grey';
import orange from '@material-ui/core/colors/orange';
import '../Home.css'
import CodeFlyout from './CodeFlyout';
const { makeid, validIdHelper, prettifyString } = require('../../tools');


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


function descendingComparator(a, b, orderBy) {
    if (a[orderBy] && b[orderBy] && b[orderBy].value < a[orderBy].value) {
        return -1;
    }
    if (a[orderBy] && b[orderBy] && b[orderBy].value > a[orderBy].value) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function FilterBar(props) {
    const { staticContent, staticContent: { lookerContent }, classes, action } = props;
    let measureCounter = 0;
    let dimensionCounter = 0;

    const [expanded, setExpanded] = useState(true);
    const [fieldsChipData, setFieldsChipData] = useState(lookerContent[0].queryBody.fields.map((item, index) => {
        return {
            key: 'fieldChipData' + index,
            label: prettifyString(item.substring(item.lastIndexOf('.') + 1, item.length)),
            datalabel: item,
            selected: true,
            fieldType: lookerContent[0].fieldType[item]
        }
    }));
    const [queryModified, setQueryModified] = useState(false);
    const [filtersData, setFilterData] = useState(Object.keys(lookerContent[0].queryBody.filters).map((key, index) => {
        return {
            key: 'filter' + index,
            label: key,
            value: lookerContent[0].queryBody.filters[key],
            type: lookerContent[0].filterType[key]
        }
    }))

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
                            Select KPIs:
        {
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
                                })
                            }<br />
                        </Typography>
                    </Grid>
                    <Grid item sm={12}>
                        <Typography variant="subtitle1">
                            Group KPIs By:
                            {
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
                                })
                            }<br />
                        </Typography>
                    </Grid>

                    <Grid item sm={12}>
                        <Typography variant="subtitle1">
                            Filter By:
                        </Typography>
                        {filtersData.map((item, index) => {
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
                        })}
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
                label="Dense padding"
            />
        </div>
    );
}

const greyPrimary = grey[400];
const greySecondary = grey[100];
const orangePrimary = orange[400];
const orangeSecondary = orange[100];

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    flexCentered: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    hidden: {
        visibility: 'hidden',
        position: 'absolute', //hack for obscuring other elements within Box
        zIndex: -1
    },
    tabs: {
        backgroundColor: 'white',
        color: '#6c757d'
    },
    dNone: {
        display: 'none'
    },
    dBlock: {
        display: 'block'
    },
    tree: {
        height: 240,
        flexGrow: 1,
        maxWidth: 400,
    },
    icon: {
        marginRight: 12,
        fontSize: '1rem',
        overflow: 'visible'
    },
    ml12: {
        marginLeft: 12
    },
    mt12: {
        marginTop: 12
    },
    w100: {
        width: '100%'
    },
    mlAuto: {
        marginLeft: 'auto'
    },
    table: {
        minWidth: 650,
    },
    tableContainer: {
        maxHeight: 650,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    greyPrimary: {
        backgroundColor: greyPrimary
    },
    greySecondary: {
        backgroundColor: greySecondary
    },
    orangePrimary: {
        backgroundColor: orangePrimary
    },
    orangeSecondary: {
        backgroundColor: orangeSecondary
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    skeleton: {
        minWidth: 275,
        minHeight: 600,
    },
    card: {
        minWidth: 275,
        minHeight: 600,
    },
    textCenter: {
        textAlign: 'center'
    }
}));


export default function QueryBuilder(props) {

    const classes = useStyles();
    const { staticContent, staticContent: { lookerContent }, staticContent: { type }, activeTabValue, handleTabChange, lookerUser, sampleCode } = props;
    const sampleCodeTab = { type: 'sample code', label: 'Code', id: 'sampleCode', lookerUser, sampleCode, }
    const tabContent = [...lookerContent, sampleCodeTab];
    const demoComponentType = type || 'sample code';

    const [value, setValue] = useState(0);
    const [apiContent, setApiContent] = useState({});

    const handleChange = (event, newValue) => {
        handleTabChange(0);
        setValue(newValue);
    };

    useEffect(() => {
        lookerContent.map(lookerContent => {
            action(lookerContent.queryBody, lookerContent.resultFormat)
        })
    }, [lookerContent])

    const action = async (newQuery, resultFormat) => {
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
                                        className={item.type === 'sample code' ? `${classes.mlAuto}` : ``}
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
                                        {tabContentItem.type === 'sample code' ?
                                            <Grid item sm={12} >
                                                <Typography variant="h6" component="h6" className={classes.gridTitle}>
                                                    Sample Code:<br />
                                                </Typography>
                                                <CodeFlyout code={tabContentItem.sampleCode} />
                                                <Typography variant="h6" component="h6" className={classes.gridTitle}>
                                                    Looker User:<br />
                                                </Typography>
                                                <CodeFlyout code={tabContentItem.lookerUser} />
                                            </Grid>
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