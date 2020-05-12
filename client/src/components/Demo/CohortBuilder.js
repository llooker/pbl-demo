import $ from 'jquery';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
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
import ComboBox from '../Material/ComboBox';
// import HUE from '@material-ui/core/colors/HUE';
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
}));

export default function CohortBuilder(props) {
    // console.log('CohortBuilder')
    // console.log('props', props)

    const classes = useStyles();
    const [value, setValue] = useState(0);
    const { staticContent, staticContent: { lookerContent }, staticContent: { type }, apiContent, action, activeTabValue, handleTabChange, lookerUser, sampleCode } = props;
    const sampleCodeTab = { type: 'sample code', label: 'Code', id: 'sampleCode', lookerUser, sampleCode }
    const tabContent = [...lookerContent, sampleCodeTab]

    let demoComponentType = type || 'sample code';

    const handleChange = (event, newValue) => {
        handleTabChange(0);
        setValue(newValue);
    };

    useEffect(() => {
        //change from drill click
        if (activeTabValue > value) {
            setValue(activeTabValue)
        }
    });

    return (
        <div className={`${classes.root} demoComponent`}>
            <Grid container
                spacing={3}
                key={validIdHelper(type)} >
                <div className={classes.root}>
                    {/* {iFrameExists ? '' :
                        <Grid item sm={12} >

                            <Card className={`${classes.card} ${classes.flexCentered}`}>
                                <CircularProgress className={classes.circularProgress} />
                            </Card>
                        </Grid>
                    }

                    <Box className={iFrameExists ? `` : `${classes.hidden}`}>
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
                                                {tabContentItem.filter ?
                                                    <Grid item sm={12}>
                                                        <ComboBox
                                                            options={apiContent}
                                                            action={action}
                                                            correspondingContentId={tabContentItem.id}
                                                            filterName={tabContentItem.filter.filterName} />
                                                    </Grid> : ''

                                                }
                                                <Box className={classes.w100} mt={2}>
                                                    <Grid item sm={12}>
                                                        <div
                                                            className="embedContainer"
                                                            id={validIdHelper(`embedContainer-${demoComponentType}-${tabContentItem.id}`)}
                                                            key={validIdHelper(`embedContainer-${demoComponentType}-${tabContentItem.id}`)}
                                                        >
                                                        </div>
                                                    </Grid>
                                                </Box>
                                            </React.Fragment>
                                        }
                                    </Grid>
                                </TabPanel>
                            ))}
                        </Box>
                    </Box > */}

                    <Box
                        className={classes.w100}
                        mt={2}>
                        {apiContent.status === 'running' ?

                            <Grid item sm={12} >
                                {/* <Skeleton variant="rect" animation="wave" className={classes.skeleton} /> */}
                                <Card className={`${classes.card} ${classes.flexCentered}`}>
                                    <CircularProgress className={classes.circularProgress} />
                                </Card>
                            </Grid>

                            : apiContent.filterContent && Object.keys(apiContent.filterContent).length ?


                                <Grid item sm={12}>

                                    {/* <Typography variant="h6" component="h6" className={`${classes.gridTitle} ${classes.textCenter}`}>
                                        We goooooddd<br />
                                    </Typography> */}

                                    <FilterBar

                                        id={`${validIdHelper(demoComponentType + '-FilterBar')}`}
                                        key={`${validIdHelper(demoComponentType + '-FilterBar')}`}
                                        {...props}
                                        classes={classes}
                                    // demoComponentType={demoComponentType}
                                    />

                                </Grid>
                                :
                                <Grid item sm={12} >
                                    <Typography variant="h6" component="h6" className={`${classes.gridTitle} ${classes.textCenter}`}>
                                        Something went wrong<br />
                                    </Typography>
                                </Grid>
                        }
                    </Box>
                </div>
            </Grid >
        </div >
    )
}


function FilterBar(props) {
    console.log('FilterBar')
    console.log('props', props)
    // const classes = useFilterBarStyles();
    const { staticContent, staticContent: { lookerContent }, classes, action, apiContent, demoComponentType } = props;
    let measureCounter = 0;
    let dimensionCounter = 0;

    //state
    const [expanded, setExpanded] = useState(true);
    // const [fieldsChipData, setFieldsChipData] = useState(lookerContent[0].queryBody.fields.map((item, index) => {
    //     return {
    //         key: 'fieldChipData' + index,
    //         label: prettifyString(item.substring(item.lastIndexOf('.') + 1, item.length)),
    //         datalabel: item,
    //         selected: true,
    //         fieldType: lookerContent[0].fieldType[item]
    //     }
    // }));
    // const [queryModified, setQueryModified] = useState(false);
    // const [filtersData, setFilterData] = useState(Object.keys(lookerContent[0].queryBody.filters).map((key, index) => {
    //     return {
    //         key: 'filter' + index,
    //         label: key,
    //         value: lookerContent[0].queryBody.filters[key],
    //         type: lookerContent[0].filterType[key]
    //     }
    // }))

    //handlers
    const handleExpansionPanel = (event, newValue) => {
        setExpanded(expanded ? false : true);
    };

    // const handleFieldChipClick = (chip, index) => {
    //     let updatedFieldsChipData = [...fieldsChipData]
    //     updatedFieldsChipData[index].selected = updatedFieldsChipData[index].selected === false ? true : false
    //     setFieldsChipData(updatedFieldsChipData)
    //     setQueryModified(true)
    // }

    // const handleSelectChange = (index, newValue) => {
    //     let updatedFiltersData = [...filtersData]
    //     updatedFiltersData[index].value = newValue;
    //     setFilterData(updatedFiltersData)
    //     setQueryModified(true)
    // }

    // const handleQuerySubmit = (event) => {
    //     if (queryModified) {
    //         let newFields = fieldsChipData.filter(chip => chip.selected).map(item => item.datalabel);
    //         let currentFilters = {}; //needs to be object
    //         filtersData.map((item, index) => {
    //             currentFilters[item.label] = item.value
    //         })
    //         let newQueryObj = lookerContent[0].queryBody;
    //         newQueryObj.fields = newFields;
    //         newQueryObj.filters = currentFilters;
    //         action(newQueryObj, lookerContent[0].resultFormat);
    //     }
    // }

    // useEffect(() => {
    //     handleQuerySubmit()
    // }, [fieldsChipData, filtersData]);


    return (
        <ExpansionPanel expanded={expanded} onChange={handleExpansionPanel}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                {/* <Typography className={classes.heading}>Build Query</Typography> */}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Grid container spacing={3}>
                    <Grid item sm={12}>
                        <Typography variant="subtitle1">
                            Filter by:
                            {
                                Object.keys(apiContent.filterContent).map((key, index) => (

                                    // <Typography variant="subtitle1">
                                    //     {apiContent.filterContent[key].added_params.sorts[0]}
                                    // </Typography>
                                    <Grid

                                        id={`${validIdHelper(demoComponentType + 'FilterBar-Grid-' + index)}`}
                                        key={`${validIdHelper(demoComponentType + 'FilterBar-Grid-' + index)}`}
                                        item sm={12}>
                                        <ComboBox
                                            id={`${validIdHelper(demoComponentType + '-FilterBar-ComboBox-' + index)}`}
                                            key={`${validIdHelper(demoComponentType + '-FilterBar-ComboBox-' + index)}`}
                                            options={apiContent.filterContent[key].options}
                                            action={() => { console.log('action callback') }} //action
                                            // correspondingContentId={tabContentItem.id}
                                            filterName={apiContent.filterContent[key].added_params.sorts[0]} />
                                    </Grid>
                                ))
                            }<br />
                        </Typography>
                    </Grid>
                </Grid>
            </ExpansionPanelDetails>
        </ExpansionPanel >
    )
}