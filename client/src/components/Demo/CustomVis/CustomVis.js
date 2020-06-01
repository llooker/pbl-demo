import $ from 'jquery';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import ComboBox from '../../Material/ComboBox';
import Skeleton from '@material-ui/lab/Skeleton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import _ from 'lodash'
import '../../Home.css'
import CodeFlyout from '../CodeFlyout';
import { ResponsiveCalendar } from '@nivo/calendar'
var moment = require('moment'); // require
const { validIdHelper } = require('../../../tools');

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

function FilterBar(props) {
    // console.log('FilterBar');
    // console.log('props', props);
    const { staticContent, staticContent: { lookerContent }, classes, action, apiContent,
        fromDate, toDate, category, handleFromDate, handleToDate, handleCategory
    } = props;

    const [expanded, setExpanded] = useState(true);

    //handlers
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
                {/* <Typography className={classes.heading}>Filter Data</Typography> */}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Grid container spacing={3}>
                    {apiContent.data ?
                        <>
                            <Grid item sm={12}>
                                <Typography variant="subtitle1">
                                    Filter by Date:
                    </Typography>
                            </Grid>
                            <Grid item sm={3}>
                                <form className={classes.container} noValidate>
                                    <TextField
                                        id="fromDate"
                                        label="From date"
                                        type="date"
                                        // defaultValue={fromDate}
                                        value={fromDate}
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={(event) => handleFromDate(event.target.value)}
                                    // formatDate={(date) => moment(new Date()).format('MM-DD-YY')}
                                    />
                                </form>
                            </Grid>
                            <Grid item sm={3}>
                                <form className={classes.container} noValidate>
                                    <TextField
                                        id="toDate"
                                        label="To date"
                                        type="date"
                                        // defaultValue={toDate}
                                        value={toDate}
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={(event) => handleToDate(event.target.value)}
                                    // formatDate={(date) => moment(new Date()).format('MM-DD-YY')}
                                    />
                                </form>
                            </Grid>

                            <Grid item sm={12}>
                                <Typography variant="subtitle1">
                                    Filter by Product Category:
                    </Typography>
                            </Grid>
                            <Grid item sm={12}>

                                <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
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

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
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
    mt12: {
        marginTop: 12
    },
    w100: {
        width: '100%'
    },
    mlAuto: {
        marginLeft: 'auto'
    },
    skeleton: {
        minWidth: 275,
        minHeight: 600,
    },
    card: {
        minWidth: 275,
        minHeight: 800,
    },
    height500: {
        height: 500
    },
    height700: {
        height: 700
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    skeleton: {
        height: 200,
        width: '100%'
    }
}));

export default function CustomVis(props) {
    // console.log('CustomVis')
    // console.log('props', props)

    const classes = useStyles();
    const [value, setValue] = useState(0);
    const { staticContent, staticContent: { lookerContent }, staticContent: { type }, apiContent, action, activeTabValue, handleTabChange, lookerUser, sampleCode } = props;
    const sampleCodeTab = { type: 'sample code', label: 'Code', id: 'sampleCode', lookerUser, sampleCode }
    const tabContent = [...lookerContent, sampleCodeTab]
    const [fromDate, setFromDate] = useState(apiContent.data ? apiContent.data[0][apiContent.data[0].length - 1].day : '');
    const [toDate, setToDate] = useState(apiContent.data ? apiContent.data[0][0].day : '');
    const [category, setCategory] = useState('All')

    let demoComponentType = type || 'sample code';

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

    let filterData = [[], []]
    if (apiContent && apiContent.originalData && apiContent.originalData[0]) {
        filterData[0] = _.filter(apiContent.originalData[0], (row) => {
            return (row.day > fromDate
                && row.day < toDate
                && (category === 'All' ? true : row.category === category))
        })

        if (category === 'All') {
            //create array of all unique dates
            const uniqueDates = [...new Set(filterData[0].map(item => item.day))];
            let filteredAndReducedForAll = []
            //iterate over unique date
            uniqueDates.map(uniqueDate => {
                //filter filterData for current unique date
                let value = _.filter(filterData[0], row => {
                    return row.day === uniqueDate
                }).reduce((acc, { value }) => acc + value, 0)
                //create object with desired format 
                let thisObj = {
                    day: uniqueDate,
                    value: value,
                    category: 'All'
                }
                filteredAndReducedForAll.push(thisObj)

            })
            // console.log('filteredAndReducedForAll', filteredAndReducedForAll)
            filterData[0] = filteredAndReducedForAll;
        }
    }
    if (apiContent && apiContent.originalData && apiContent.originalData[1]) {
        filterData[1] = _.filter(apiContent.originalData[1], (row) => {
            return (row.day > fromDate
                && row.day < toDate
                && (category === 'All' ? true : row.category === category))
        })

        if (category === 'All') {
            //create array of all unique dates
            const uniqueDates = [...new Set(filterData[1].map(item => item.day))];
            let filteredAndReducedForAll = []
            //iterate over unique date
            uniqueDates.map(uniqueDate => {
                //filter filterData for current unique date
                let value = _.filter(filterData[1], row => {
                    return row.day === uniqueDate
                }).reduce((acc, { value }) => acc + value, 0)
                //create object with desired format 
                let thisObj = {
                    day: uniqueDate,
                    value: value,
                    category: 'All'
                }
                filteredAndReducedForAll.push(thisObj)

            })
            // console.log('filteredAndReducedForAll', filteredAndReducedForAll)
            filterData[1] = filteredAndReducedForAll;
        }
    }


    useEffect(() => {
        if (apiContent.originalData) {
            setFromDate(apiContent.data[0][apiContent.data[0].length - 1].day)
            setToDate(apiContent.data[0][0].day)
        }
    }, [apiContent.originalData]);

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
                                                <Typography variant="h5" component="h2" className={classes.gridTitle}>
                                                    Sample Code<br />
                                                </Typography>
                                                <CodeFlyout code={tabContentItem.sampleCode} />
                                                <Typography variant="h5" component="h2" className={classes.gridTitle}>
                                                    Looker User<br />
                                                </Typography>
                                                <CodeFlyout code={tabContentItem.lookerUser} />
                                            </Grid>
                                            :
                                            <React.Fragment
                                                key={`${validIdHelper(demoComponentType + '-innerFragment-' + index)}`}>

                                                {!apiContent.status || apiContent.status === 'running' ?
                                                    <Skeleton variant="rect" animation="wave" className={classes.skeleton} />

                                                    :
                                                    <FilterBar {...props}
                                                        classes={classes}
                                                        action={filterData}
                                                        fromDate={fromDate}
                                                        toDate={toDate}
                                                        category={category}
                                                        handleFromDate={handleFromDate}
                                                        handleToDate={handleToDate}
                                                        handleCategory={handleCategory}
                                                    />
                                                }
                                                <Divider className={classes.divider} />
                                                <Box
                                                    className={classes.w100}
                                                    mt={2}>
                                                    {!apiContent.status || apiContent.status === 'running' ?

                                                        <Grid item sm={12} >
                                                            {/* <Skeleton variant="rect" animation="wave" className={classes.skeleton} /> */}
                                                            <Card className={`${classes.card} ${classes.flexCentered}`}>
                                                                <CircularProgress className={classes.circularProgress} />
                                                            </Card>
                                                        </Grid>

                                                        : apiContent.data && apiContent.data.length ?
                                                            <>
                                                                <Grid item sm={12} className={classes.height700}>
                                                                    <h1>Total Sale Price by Date</h1>
                                                                    <ResponsiveCalendar
                                                                        data={filterData[0]}
                                                                        from={fromDate}
                                                                        to={toDate}
                                                                        colors={['#0302FC', '#2A00D5', '#63009E', '#A1015D', '#D80027', '#FE0002']}
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
                                                                    />
                                                                </Grid>

                                                                <Grid item sm={12} className={classes.height700}>
                                                                    <h1>Total Orders by Date</h1>
                                                                    <ResponsiveCalendar
                                                                        data={filterData[1]}
                                                                        from={fromDate}
                                                                        to={toDate}
                                                                        colors={['#0302FC', '#2A00D5', '#63009E', '#A1015D', '#D80027', '#FE0002']}
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
        </div >
    )
}

