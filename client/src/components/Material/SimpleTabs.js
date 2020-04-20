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


import $ from 'jquery';

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
            {/* {value === index &&  */}
            <Box p={3}>{children}</Box>
            {/* } */}
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
    }
}));

export default function SimpleTabs(props) {
    const { lookerContent, activeTabValue, handleTabChange } = props
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        handleTabChange(0);
        setValue(newValue);
    };


    let iFrameExists = $(".embedContainer:visible iframe").length;


    useEffect(() => {
        if (activeTabValue > value) { //change from drill click
            // console.log('inside ifff')
            setValue(activeTabValue)
        }
    })

    return (
        <div className={classes.root}>

            {/* loading logic */}
            {iFrameExists ? '' :
                <Grid item sm={12} >
                    <Card className={`${classes.card} ${classes.flexCentered}`}>
                        <CircularProgress className={classes.circularProgress} />
                    </Card>

                </Grid>
            }

            {/* additional loading logic, need embedContainer to exist but want it hidden until iFrame has content...*/}
            <Box className={iFrameExists ? `` : `${classes.hidden}`}
            // className={classes.dNone}
            >
                <AppBar position="static">
                    <Tabs
                        className={classes.tabs}
                        // indicatorColor='secondary'
                        // textColor='primary'
                        value={value}
                        onChange={handleChange}
                        aria-label="simple tabs example">
                        {lookerContent.map((item, index) => (
                            <Tab label={item.label} {...a11yProps(index)} />
                        ))}
                    </Tabs>
                </AppBar>

                {lookerContent.map((item, index) => (
                    <TabPanel value={value} index={index}>
                        <div
                            className="col-sm-12 embedContainer"
                            id={validIdHelper(`embedContainer${item.id}`)}
                        >

                        </div>
                    </TabPanel>
                ))}
            </Box>
        </div>
    );
}
