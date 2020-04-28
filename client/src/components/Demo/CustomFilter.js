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
import ComboBox from '../Material/ComboBox'
import $ from 'jquery';
import CodeSideBar from '../Demo/CodeSideBar'

import UsecaseContent from '../../usecaseContent.json'; // still necessary to map over demo components
import '../Home.css'
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

export default function CustomFilter(props) {
    // console.log('CustomFilter')
    // console.log('props', props)
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const { staticContent, staticContent: { lookerContent }, staticContent: { type }, apiContent, action, activeTabValue, handleTabChange, lookerUser, sampleCode } = props;
    const sampleCodeTab = { type: 'sample code', label: 'Code', id: 'sampleCode', lookerUser, sampleCode }
    const tabContent = [...lookerContent, sampleCodeTab]

    let iFrameExists = $(".tabPanelContainer:visible iframe").length;
    let demoComponentType = type || 'sample code';


    const handleChange = (event, newValue) => {
        handleTabChange(0);
        setValue(newValue);
    };


    return (
        <div className={classes.root}>

            <Grid container
                spacing={3}
                key={validIdHelper(type)} >

                {/* <Tabs
                    tabContent={[...lookerContent, sampleCodeTab]}
                    activeTabValue={activeTabValue}
                    handleTabChange={handleTabChange}
                    apiContent={apiContent}
                    action={action}
                    demoComponentType={type || 'sample code'} /> */}

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
                                        key={`${validIdHelper(demoComponentType + '-tab-' + index)}`} //
                                        label={item.label}
                                        className={item.type === 'sample code' ? `${classes.mlAuto}` : ``}
                                        {...a11yProps(index)} />
                                ))}
                            </Tabs>
                        </AppBar>

                        <Box className="tabPanelContainer">
                            {tabContent.map((tabContentItem, index) => (
                                <TabPanel
                                    key={`${validIdHelper(demoComponentType + '-tabPanel-' + index)}`} //
                                    value={value}
                                    index={index}>
                                    <Grid container>
                                        {tabContentItem.type === 'sample code' ?

                                            <Grid item sm={12} >

                                                <Typography variant="h5" component="h2" className={classes.gridTitle}>
                                                    Sample Code<br />
                                                </Typography>
                                                <CodeSideBar code={tabContentItem.sampleCode} />
                                                <Typography variant="h5" component="h2" className={classes.gridTitle}>
                                                    Looker User<br />
                                                </Typography>
                                                <CodeSideBar code={tabContentItem.lookerUser} />
                                            </Grid> :
                                            <React.Fragment
                                                key={`${validIdHelper(demoComponentType + '-innerFragment-' + index)}`}>
                                                <Grid item sm={12}>

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
                    </Box >
                </div>
            </Grid >
        </div >
    )
}