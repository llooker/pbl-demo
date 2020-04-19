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
        minHeight: 720,
    },
    flexCentered: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));

export default function SimpleTabs(props) {
    const { lookerContent, activeTabValue, handleTabChange } = props
    // console.log('activeTabValue', activeTabValue)
    const classes = useStyles();
    // const [value, setValue] = React.useState(activeTabValue);
    const [value, setValue] = useState(0);
    // console.log('value', value)

    const handleChange = (event, newValue) => {
        // console.log('handleChange');
        // console.log('event', event);
        // console.log('newValue', newValue);
        handleTabChange(0);
        setValue(newValue);
    };


    useEffect(() => {
        // console.log('useEffect')
        // action on update of value??
        // console.log('value', value)
        if (activeTabValue > value) { //change from drill click
            // console.log('inside ifff')
            setValue(activeTabValue)
        }
        // else {
        //     console.log('inside ellse')
        //     setValue(0)
        // }
    })
    // console.log('value', value)

    return (
        <div className={classes.root}>

            {$('.embedContainer:visible iframe').length ? '' :
                <Grid item sm={12} >
                    <Card className={`${classes.card} ${classes.flexCentered}`}>
                        <CircularProgress className={classes.circularProgress} />
                    </Card>

                </Grid>}

            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    {lookerContent.map((item, index) => (
                        <Tab label={item.label} {...a11yProps(index)} />
                    ))}
                </Tabs>
            </AppBar>

            {lookerContent.map((item, index) => (
                <TabPanel value={value} index={index}>
                    <div id={validIdHelper(`embedContainer${item.id}`)} className="col-sm-12 embedContainer"></div>
                </TabPanel>
            ))}
        </div>
    );
}
