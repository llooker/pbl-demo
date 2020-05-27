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
import ComboBox from '../Material/ComboBox';
import Skeleton from '@material-ui/lab/Skeleton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import '../Home.css'
import CodeFlyout from './CodeFlyout';
import { ResponsiveCalendar } from '@nivo/calendar'
const { validIdHelper } = require('../../tools');

console.log('ResponsiveCalendar', ResponsiveCalendar)

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

const data = [
    {
        "day": "2017-08-21",
        "value": 361
    },
    {
        "day": "2015-05-18",
        "value": 68
    },
    {
        "day": "2016-07-21",
        "value": 114
    },
    {
        "day": "2017-01-10",
        "value": 310
    },
    {
        "day": "2015-06-02",
        "value": 149
    },
    {
        "day": "2017-12-09",
        "value": 32
    },
    {
        "day": "2016-12-11",
        "value": 33
    },
    {
        "day": "2016-01-16",
        "value": 78
    },
    {
        "day": "2016-04-28",
        "value": 281
    },
    {
        "day": "2016-11-15",
        "value": 255
    },
    {
        "day": "2016-07-26",
        "value": 57
    },
    {
        "day": "2017-07-24",
        "value": 199
    },
    {
        "day": "2015-12-12",
        "value": 239
    },
    {
        "day": "2016-02-19",
        "value": 90
    },
    {
        "day": "2015-11-20",
        "value": 266
    },
    {
        "day": "2017-06-25",
        "value": 227
    },
    {
        "day": "2017-10-07",
        "value": 155
    },
    {
        "day": "2016-07-22",
        "value": 120
    },
    {
        "day": "2016-07-06",
        "value": 44
    },
    {
        "day": "2017-09-15",
        "value": 362
    },
    {
        "day": "2017-10-25",
        "value": 169
    },
    {
        "day": "2015-06-24",
        "value": 52
    },
    {
        "day": "2016-09-11",
        "value": 296
    },
    {
        "day": "2017-07-13",
        "value": 185
    },
    {
        "day": "2016-08-21",
        "value": 99
    },
    {
        "day": "2017-12-18",
        "value": 312
    },
    {
        "day": "2017-11-02",
        "value": 116
    },
    {
        "day": "2017-11-29",
        "value": 377
    },
    {
        "day": "2018-06-09",
        "value": 56
    },
    {
        "day": "2017-03-02",
        "value": 363
    },
    {
        "day": "2016-04-08",
        "value": 362
    },
    {
        "day": "2016-12-02",
        "value": 389
    },
    {
        "day": "2017-01-14",
        "value": 112
    },
    {
        "day": "2016-06-16",
        "value": 329
    },
    {
        "day": "2017-02-12",
        "value": 111
    },
    {
        "day": "2017-06-05",
        "value": 93
    },
    {
        "day": "2018-05-20",
        "value": 165
    },
    {
        "day": "2016-05-30",
        "value": 287
    },
    {
        "day": "2015-04-16",
        "value": 25
    }];

export default function CustomVis(props) {
    console.log('CustomVis')
    console.log('props', props)
    console.log('000 data', data)

    // data.sort(function (a, b) {
    //     return new Date(a.day) - new Date(b.day)
    // });

    // console.log('111 data', data)

    const classes = useStyles();
    const [value, setValue] = useState(0);
    const { staticContent, staticContent: { lookerContent }, staticContent: { type }, apiContent, action, activeTabValue, handleTabChange, lookerUser, sampleCode } = props;
    const sampleCodeTab = { type: 'sample code', label: 'Code', id: 'sampleCode', lookerUser, sampleCode }
    const tabContent = [...lookerContent, sampleCodeTab]

    let iFrameExists = $(".tabPanelContainer:visible iframe").length;
    let demoComponentType = type || 'sample code';
    // const [data, setData] = useState(data);



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
                    {apiContent.length ? '' :
                        <Grid item sm={12} >
                            {/* <Skeleton variant="rect" animation="wave" className={classes.skeleton} /> */}

                            <Card className={`${classes.card} ${classes.flexCentered}`}>
                                <CircularProgress className={classes.circularProgress} />
                            </Card>
                        </Grid>
                    }

                    {/* additional loading logic, need embedContainer to exist but want it hidden until iFrame has content...*/}
                    <Box className={apiContent.length ? `` : `${classes.hidden}`}>
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
                                            <Grid item sm={12}>
                                                <React.Fragment
                                                    key={`${validIdHelper(demoComponentType + '-innerFragment-' + index)}`}>
                                                    <h1>ResponsiveCalendar????</h1>
                                                    <ResponsiveCalendar
                                                        data={data}
                                                        from="2015-03-01"
                                                        to="2016-03-01"
                                                        // emptyColor="#eeeeee"
                                                        colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
                                                        // margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                                                        // yearSpacing={40}
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
                                                        height={500}
                                                    />
                                                </React.Fragment>
                                            </Grid>
                                        }
                                        <ResponsiveCalendar
                                            data={data}
                                            from="2015-03-01"
                                            to="2016-03-01"
                                            // emptyColor="#eeeeee"
                                            colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
                                            // margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                                            // yearSpacing={40}
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
                                        />
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

// const MyResponsiveCalendar = ({ data /* see data tab */ }) => (
//     <ResponsiveCalendar
//         data={data}
//         from="2015-03-01"
//         to="2016-07-12"
//         emptyColor="#eeeeee"
//         colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
//         margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
//         yearSpacing={40}
//         monthBorderColor="#ffffff"
//         dayBorderWidth={2}
//         dayBorderColor="#ffffff"
//         legends={[
//             {
//                 anchor: 'bottom-right',
//                 direction: 'row',
//                 translateY: 36,
//                 itemCount: 4,
//                 itemWidth: 42,
//                 itemHeight: 36,
//                 itemsSpacing: 14,
//                 itemDirection: 'right-to-left'
//             }
//         ]}
//     />
// )

