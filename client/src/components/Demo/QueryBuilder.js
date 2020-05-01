import $ from 'jquery';
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
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import Divider from '@material-ui/core/Divider';
import { palette } from '@material-ui/system';
import grey from '@material-ui/core/colors/grey';
import indigo from '@material-ui/core/colors/indigo';
import teal from '@material-ui/core/colors/teal';
// import HUE from '@material-ui/core/colors/HUE';


import '../Home.css'
import CodeSideBar from '../Demo/CodeSideBar';
const { validIdHelper } = require('../../tools');

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
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
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

const useFilterBarStyles = makeStyles((theme) => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    ml12: {
        marginLeft: 12
    }
}));

function FilterBar(props) {
    // console.log('FilterBar')
    // console.log('props', props)
    // const classes = useFilterBarStyles();
    const { staticContent, staticContent: { lookerContent }, apiContent, classes, action } = props;
    let measureCounter = 0;
    let dimensionCounter = 0;

    //state
    const [expanded, setExpanded] = useState(true);
    const [fieldsChipData, setFieldsChipData] = useState(lookerContent[0].queryBody.fields.map((item, index) => {
        return {
            key: 'fieldChipData' + index,
            label: item, //prettifyString(item.substring(item.lastIndexOf('.') + 1, item.length)), 
            selected: true,
            fieldType: lookerContent[0].fieldType[index]
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

    //handlers
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
            let newFields = fieldsChipData.filter(chip => chip.selected).map(item => item.label)
            let currentFilters = {}; //needs to be object
            filtersData.map((item, index) => {
                currentFilters[item.label] = item.value
            })
            // console.log('currentFilters', currentFilters)
            let newQueryObj = lookerContent[0].queryBody;
            newQueryObj.fields = newFields;
            newQueryObj.filters = currentFilters;
            // console.log('newQueryObj', newQueryObj)
            action(newQueryObj, lookerContent[0].resultFormat);
        }
    }


    useEffect(() => {
        // console.log('useEffect')
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
                    {/* <Grid item sm={2}>
                        <Typography variant="subtitle1">
                            Model: <Chip className={classes.ml12} label={lookerContent[0].queryBody.model} disabled /><br />
                        </Typography>
                    </Grid>
                    <Grid item sm={2}>
                        <Typography variant="subtitle1">
                            View: <Chip className={classes.ml12} label={lookerContent[0].queryBody.view} disabled /><br />
                        </Typography>
                    </Grid> */}

                    <Grid item sm={12}>
                        <Typography variant="subtitle1">
                            Select KPIs:
        {
                                fieldsChipData.map((item, index) => {
                                    return (
                                        item.fieldType === 'measure' ?
                                            <Chip
                                                key={item.label}
                                                measurecounter={measureCounter += 1}
                                                className={item.selected ? `${classes.tealPrimary}` : ``}
                                                label={item.label}
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
                                                className={item.selected ? `${classes.indigoPrimary}` : ``}
                                                label={item.label}
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
                                <FormControl className={classes.formControl} key={validIdHelper(`${item.label}FormControl`)}>

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
                    {/* <Grid item sm={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={apiContent.length ? false : true}
                            onClick={handleQuerySubmit}
                        >
                            Submit</Button>
                    </Grid> */}
                </Grid>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
}

function EnhancedTableHead(props) {
    const { apiContent, classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {Object.keys(apiContent[0]).map((key, index) => (
                    <TableCell
                        key={validIdHelper(key + '-TableHead-TableCell-' + index)}
                        id={validIdHelper(key + '-TableHead-TableCell-' + index)}
                        // align={key.numeric ? 'left' : 'right'}
                        align='right'
                        padding={key.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === key ? order : false}>
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
    onRequestSort: PropTypes.func.isRequired,
    // order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    // orderBy: PropTypes.string.isRequired,
};


function EnhancedTable(props) {
    // console.log('EnhancedTable')
    const { apiContent, classes, lookerContent } = props;
    const [order, setOrder] = React.useState(''); //'asc'
    const [orderBy, setOrderBy] = React.useState(''); //'lookerContent[0].queryBody.fields[0]'

    //handlers
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <TableContainer component={Paper} className={classes.tableContainer}>
            <Table stickyHeader className={classes.table} size="small" aria-label="a dense table">
                <EnhancedTableHead
                    {...props}
                    classes={classes}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                />
                <TableBody>
                    {stableSort(apiContent, getComparator(order, orderBy))
                        .map((item, index) => (
                            <TableRow
                                key={validIdHelper('TableRow-' + index)}
                                id={validIdHelper('TableRow-' + index)}>
                                {Object.keys(item).map((key, index) => (
                                    <TableCell
                                        key={validIdHelper(key + '-TableBody-TableCell-' + index)}
                                        id={validIdHelper(key + '-TableBody-TableCell-' + index)}
                                        className={lookerContent[0].fieldType[index] === 'dimension' ? classes.indigoSecondary : classes.tealSecondary}
                                        align="right">
                                        {typeof item[key].value === 'number' ? Math.round(item[key].value * 100) / 100 : item[key].value}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>)
}


// const lightBackground = grey[100];
// const color = HUE[SHADE];
const indigoPrimary = indigo[400];
const indigoSecondary = indigo[100];
const tealPrimary = teal[400];
const tealSecondary = teal[100];

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    card: {
        minWidth: 275,
        minHeight: 800,
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
    indigoPrimary: {
        backgroundColor: indigoPrimary
    },
    indigoSecondary: {
        backgroundColor: indigoSecondary
    },
    tealPrimary: {
        backgroundColor: tealPrimary
    },
    tealSecondary: {
        backgroundColor: tealSecondary
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));


export default function QueryBuilder(props) {
    // console.log('QueryBuilder')
    // console.log('props', props)

    const classes = useStyles();
    const { staticContent, staticContent: { lookerContent }, staticContent: { type }, apiContent, action, activeTabValue, handleTabChange, lookerUser, sampleCode } = props;
    const sampleCodeTab = { type: 'sample code', label: 'Code', id: 'sampleCode', lookerUser, sampleCode }
    const tabContent = [...lookerContent, sampleCodeTab];
    const demoComponentType = type || 'sample code';

    // console.log('apiContent', apiContent)

    //state
    const [value, setValue] = useState(0);

    //handlers
    const handleChange = (event, newValue) => {
        handleTabChange(0);
        setValue(newValue);
    };

    const handleDelete = () => {
        console.info('You clicked the delete icon.');
    };

    return (
        < div className={classes.root} >
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
                                                <Typography variant="h5" component="h2" className={classes.gridTitle}>
                                                    Sample Code<br />
                                                </Typography>
                                                <CodeSideBar code={tabContentItem.sampleCode} />
                                                <Typography variant="h6" component="h6" className={classes.gridTitle}>
                                                    Looker User<br />
                                                </Typography>
                                                <CodeSideBar code={tabContentItem.lookerUser} />
                                            </Grid>
                                            :


                                            <React.Fragment
                                                key={`${validIdHelper(demoComponentType + '-innerFragment-' + index)}`}>
                                                <FilterBar {...props}
                                                    classes={classes}
                                                />
                                                <Divider className={classes.divider} />
                                                <Box
                                                    className={classes.w100}
                                                    mt={2}>
                                                    {apiContent.length ?
                                                        <Grid item sm={12}>

                                                            <EnhancedTable
                                                                {...props}
                                                                classes={classes}
                                                                apiContent={apiContent}
                                                                lookerContent={lookerContent}
                                                            >
                                                            </EnhancedTable>

                                                        </Grid> :

                                                        <Grid item sm={12} >
                                                            <Card className={`${classes.card} ${classes.flexCentered}`}>
                                                                <CircularProgress className={classes.circularProgress} />
                                                            </Card>
                                                        </Grid>
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
        </div >
    )
}

function prettifyString(str) {
    var i, frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
}