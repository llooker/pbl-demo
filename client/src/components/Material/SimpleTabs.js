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

import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import Icon from '@material-ui/core/Icon';
import CodeIcon from '@material-ui/icons/Code';

import ComboBox from './ComboBox'
import $ from 'jquery';
import CodeSideBar from '../Demo/CodeSideBar'

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
    mt12: {
        marginTop: 12
    },
    w100: {
        width: '100%'
    },
    mlAuto: {
        marginLeft: 'auto'
    }
}));

export default function SimpleTabs(props) {
    // console.log('SimpleTabs')
    // console.log('props', props)
    const { tabContent, activeTabValue, handleTabChange, apiContent, action } = props; //demoComponentType
    console.log('tabContent', tabContent)
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [selected, setSelected] = useState(2)
    const [expanded, setExpanded] = useState(["1"]);

    const handleChange = (event, newValue) => {
        handleTabChange(0);
        setValue(newValue);
    };

    // let iFrameExists = $(".embedContainer:visible iframe").length;
    let iFrameExists = $(".tabPanelsContainer:visible iframe").length
    console.log('iFrameExists', iFrameExists)

    useEffect(() => {
        //change from drill click
        if (activeTabValue > value) {
            setValue(activeTabValue)
        }
    });

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    }

    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds);
    };


    let treeCounter = 0;  //for now
    return (
        <div className={classes.root}>
            {/* loading  */}
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
                        value={value}
                        onChange={handleChange}
                        aria-label="simple tabs example">
                        {tabContent.map((item, index) => (
                            <Tab label={item.label} {...a11yProps(index)} className={item.type === 'sample code' ? `${classes.mlAuto}` : ``} />
                        ))}
                    </Tabs>
                </AppBar>

                <Box className="tabPanelsContainer">
                    {tabContent.map((tabContentItem, index) => (
                        <TabPanel value={value} index={index}>
                            <Grid container>
                                {tabContentItem.type === 'report builder' && index === 0 ?
                                    <>
                                        <Grid item sm={3} >

                                            <TreeView
                                                className={classes.tree}
                                                defaultCollapseIcon={<ExpandMoreIcon />}
                                                defaultExpandIcon={<ChevronRightIcon />}
                                                expanded={expanded}
                                                // selected={selected}
                                                onNodeToggle={handleToggle}
                                                onNodeSelect={handleSelect}
                                            >
                                                {Object.keys(apiContent).length ? Object.keys(apiContent).map((key, outerIndex) => (
                                                    <>
                                                        <TreeItem
                                                            nodeId={"" + (treeCounter += 1)}
                                                            treecounter={treeCounter}
                                                            label={key.charAt(0).toUpperCase() + key.substring(1)}
                                                            icon={<Icon className={`fa fa-folder ${classes.icon}`} />}
                                                            disabled={apiContent[key].length ? false : true}
                                                        >

                                                            {
                                                                apiContent[key].length ?
                                                                    apiContent[key].map((item, index) => (
                                                                        <TreeItem
                                                                            nodeId={"" + (treeCounter += 1)}
                                                                            treecounter={treeCounter}
                                                                            selected={selected === treeCounter}
                                                                            className={selected === treeCounter ? "Mui-selected" : ""}
                                                                            contentid={item.id}
                                                                            label={item.title}
                                                                            onClick={() => {
                                                                                setSelected(treeCounter)
                                                                                action(item.id)
                                                                            }} />
                                                                    ))
                                                                    :
                                                                    ''
                                                            }
                                                        </TreeItem>

                                                    </>
                                                )) : ''}
                                            </TreeView>
                                        </Grid>
                                        <Grid item sm={9} >
                                            <div
                                                className="embedContainer"
                                                id={validIdHelper(`embedContainer${tabContentItem.id}`)}
                                            >
                                            </div>
                                        </Grid>
                                    </>
                                    :
                                    tabContentItem.type === 'custom filter' && index == 0 ?
                                        <>
                                            <Grid item sm={12} gutterBottom>

                                                <ComboBox
                                                    options={apiContent}
                                                    action={action}
                                                    correspondingContentId={tabContent[0].id}
                                                    filterName={tabContent[0].customDropdown.filterName} />
                                            </Grid>

                                            <Box className={classes.w100} mt={2}>
                                                <Grid item sm={12}>
                                                    <div
                                                        className="embedContainer"
                                                        id={validIdHelper(`embedContainer${tabContentItem.id}`)}
                                                    >
                                                    </div>
                                                </Grid>
                                            </Box>
                                        </>
                                        :
                                        tabContentItem.type === 'sample code' ?

                                            <Grid item sm={12} >
                                                <CodeSideBar lookerUser={tabContentItem.lookerUser} />
                                            </Grid>
                                            :
                                            <Grid item sm={12} >
                                                <div
                                                    className="embedContainer"
                                                    id={validIdHelper(`embedContainer${tabContentItem.id}`)}
                                                >
                                                </div>
                                            </Grid>
                                }

                            </Grid>
                        </TabPanel>
                    ))}
                </Box>
            </Box>
        </div >
    );
}
