import _ from 'lodash'
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
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import '../Home.css'
import CodeFlyout from './CodeFlyout';

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

export default function SplashPage(props) {

    // console.log('SplashPage')
    // console.log('props', props)

    const classes = useStyles();
    const { staticContent, staticContent: { lookerContent }, staticContent: { type }, activeTabValue, handleTabChange, lookerUser, sampleCode } = props;
    const sampleCodeTab = { type: 'sample code', label: 'Code', id: 'sampleCode', lookerUser, sampleCode }
    const tabContent = [...lookerContent, sampleCodeTab];
    const demoComponentType = type || 'sample code';

    const [value, setValue] = useState(0);
    const [iFrameExists, setIFrame] = useState(1);
    const [apiContent, setApiContent] = useState([]);
    const [dashboardObj, setDashboardObj] = useState({});

    const handleChange = (event, newValue) => {
        handleTabChange(0);
        setValue(newValue);
    };

    useEffect(() => {
        //change from drill click
        if (activeTabValue > value) {
            setValue(activeTabValue)
        }

        lookerContent.map(lookerContent => {
            if (lookerContent.type === 'query') {
                // console.log('inside iff for query');
            } else if (lookerContent.type === 'look') {
                // console.log('inside else iff for look');
                LookerEmbedSDK.createLookWithId(lookerContent.id)
                    .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`))
                    .withClassName('iframe')
                    .withClassName('look')
                    .withClassName(lookerContent.id)
                    .build()
                    .connect()
                    .catch((error) => {
                        console.error('Connection error', error)
                    })
            }
        })


    }, [lookerContent]);


    return (
        <div className={`${classes.root} demoComponent`}>
            <Grid container
                spacing={3}
                key={validIdHelper(type)} >
                <div className={classes.root}>
                    {iFrameExists ? '' :
                        <Grid item sm={12} >
                            <Card className={`${classes.card} ${classes.flexCentered}`}>
                                <CircularProgress className={classes.circularProgress} />
                            </Card>
                        </Grid>
                    }

                    {/* additional loading logic, need embedContainer to exist but want it hidden until iFrame has content...*/}
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
                                                <Grid item sm={4}>

                                                    <Typography variant="h5" component="h2" className={classes.gridTitle}>
                                                        Welcome {lookerUser.user_attributes.brand}!<br />
                                                    </Typography>
                                                    <br />
                                                    <Typography variant="h5" component="h5" className={classes.gridTitle}>
                                                        {staticContent.description}<br />
                                                    </Typography>
                                                </Grid>
                                                <Grid item sm={6}>
                                                    <div
                                                        className="embedContainer"
                                                        id={validIdHelper(`embedContainer-${demoComponentType}-${tabContentItem.id}`)}
                                                        key={validIdHelper(`embedContainer-${demoComponentType}-${tabContentItem.id}`)}
                                                    >
                                                    </div>
                                                </Grid>
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