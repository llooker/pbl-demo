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
// import ComboBox from '../../Material/ComboBox';
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
    const { staticContent, staticContent: { lookerContent }, staticContent: { type }, classes,
        //action, apiContent,
        helperContent,
        fromDate, toDate, category, desiredField, handleFromDate, handleToDate, handleCategory, handleDesiredField
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
                <Typography className={classes.heading}>Filter Data</Typography>

            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Grid container spacing={3}>
                    {helperContent && helperContent.apiContent ?
                        <>
                            <Grid item sm={3}>
                                {/* <Typography variant="subtitle1">
                                    Filter by Field:
                                </Typography> */}
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
                                {/* <Typography variant="subtitle1">
                                    Filter by Date:
                            </Typography> */}
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
                                {/* <Typography variant="subtitle1" className={classes.hidden}>
                                    Filter by Date:
                            </Typography> */}
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
                            <Grid item sm={3}>
                                {/* <Typography variant="subtitle1">
                                    Filter by Product Category:
                                </Typography> */}
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
                                        {helperContent.apiContent.uniqueCategories.map((item, index) => (

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
        // position: 'absolute', //hack for obscuring other elements within Box
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
    height800: {
        height: 800
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
    const { staticContent, staticContent: { lookerContent }, staticContent: { type },
        helperContent,
        // apiContent, action, 
        activeTabValue, handleTabChange, lookerUser, sampleCode } = props;
    const sampleCodeTab = { type: 'sample code', label: 'Code', id: 'sampleCode', lookerUser, sampleCode }
    const tabContent = [...lookerContent, sampleCodeTab]
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [category, setCategory] = useState('All')
    const [desiredField, setDesiredField] = useState(lookerContent ? lookerContent[0].desiredFields[0] : '')
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
    const handleDesiredField = newValue => {
        setDesiredField(newValue)
    }

    let filterData = [];
    if (helperContent && helperContent.apiContent) {
        //filtering for fromDate, toDate and category
        filterData = _.filter(helperContent.apiContent.queryResults, (row) => {
            return (row[helperContent.apiContent.inlineQuery.fields[0]] > fromDate
                && row[helperContent.apiContent.inlineQuery.fields[0]] < toDate
                && (category === 'All' ? true : row[helperContent.apiContent.inlineQuery.fields[1]] === category))
        })
        //converting filterDAta to desired format for vis
        filterData = filterData.map(item => {
            return {
                'day': item[helperContent.apiContent.inlineQuery.fields[0]],
                'category': item[helperContent.apiContent.inlineQuery.fields[1]],
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
        // console.log('useEffect')
        if (helperContent && helperContent.apiContent) {
            setFromDate(helperContent.apiContent.queryResults[helperContent.apiContent.queryResults.length - 1][helperContent.apiContent.inlineQuery.fields[0]]);
            setToDate(helperContent.apiContent.queryResults[0][helperContent.apiContent.inlineQuery.fields[0]]);
        }
    }, [helperContent && helperContent.apiContent]
    );

    let redToBlueColorScale = ['#0302FC', '#2A00D5', '#63009E', '#A1015D', '#D80027', '#FE0002']
    let yellowToGreenColorScale = ['#FEFE69', '#DDF969', '#A9F36A', '#A1015D', '#78EC6C', '#57E86B']

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

                                                {!helperContent ?
                                                    <Skeleton variant="rect" animation="wave" className={classes.skeleton} />
                                                    :
                                                    <FilterBar {...props}
                                                        classes={classes}
                                                        action={filterData}
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
                                                    {!helperContent ?

                                                        <Grid item sm={12} >
                                                            <Card className={`${classes.card} ${classes.flexCentered}`}>
                                                                <CircularProgress className={classes.circularProgress} />
                                                            </Card>
                                                        </Grid>

                                                        : helperContent.apiContent.queryResults && helperContent.apiContent.queryResults.length ?
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