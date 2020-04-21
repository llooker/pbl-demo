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

// import List from './SimpleList'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
// import Chip from '@material-ui/core/Chip';

import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';


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
    }
}));

export default function SimpleTabs(props) {
    // console.log('SimpleTabs')
    // console.log('props', props)
    const { lookerContent, activeTabValue, handleTabChange, demoComponentType, apiContent, action } = props;

    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [selected, setSelected] = useState(0)

    const handleChange = (event, newValue) => {
        handleTabChange(0);
        setValue(newValue);
    };

    let iFrameExists = $(".embedContainer:visible iframe").length;

    useEffect(() => {
        //change from drill click
        if (activeTabValue > value) {
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

                {lookerContent.map((lookerContentItem, index) => (
                    <TabPanel value={value} index={index}>
                        <Grid container>
                            {demoComponentType === 'report builder' && index === 0 ?
                                <>
                                    <Grid item sm={3} >
                                        {Object.keys(apiContent).length ? Object.keys(apiContent).map((key, objIndex) => (
                                            <>
                                                {objIndex > 0 ?
                                                    <Divider /> : ''}
                                                <Typography variant="h6"
                                                    noWrap
                                                    className={classes.title}
                                                    key={key}>
                                                    {key.charAt(0).toUpperCase() + key.substring(1)}:
                                                </Typography>
                                                <List component="nav" aria-label="main mailbox folders">
                                                    {
                                                        apiContent[key].length ?
                                                            apiContent[key].map((item, index) => (

                                                                <ListItem button
                                                                    key={item.id}
                                                                    contentid={item.id}
                                                                    selected={selected === index}
                                                                    onClick={() => {
                                                                        setSelected(index)
                                                                        action(event)
                                                                    }}> {item.title}

                                                                    {/* <Chip label="Basic" /> */}
                                                                </ListItem>
                                                            ))
                                                            :
                                                            <ListItem disabled> None
                                                    </ListItem>
                                                    }
                                                </List>
                                            </>
                                        )) : ''}
                                    </Grid>
                                    <Grid item sm={9} >
                                        <div
                                            className="embedContainer"
                                            id={validIdHelper(`embedContainer${lookerContentItem.id}`)}
                                        >
                                        </div>
                                    </Grid>
                                </>
                                :
                                <Grid item sm={12} >
                                    <div
                                        className="embedContainer"
                                        id={validIdHelper(`embedContainer${lookerContentItem.id}`)}
                                    >
                                    </div>
                                </Grid>
                            }

                        </Grid>
                    </TabPanel>
                ))}
            </Box>
        </div >
    );
}
