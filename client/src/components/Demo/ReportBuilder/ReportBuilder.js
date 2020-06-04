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
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import Icon from '@material-ui/core/Icon';
import Skeleton from '@material-ui/lab/Skeleton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CodeFlyout from '../CodeFlyout'
import '../../Home.css'
import Button from '@material-ui/core/Button';

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
    },
    skeleton: {
        minWidth: 275,
        minHeight: 600,
    },
    ml24: {
        marginLeft: 24
    },
    parentHoverVisibility: {
        '&:hover $childHoverVisibility': {
            visibility: 'visible'
        }

    },
    childHoverVisibility: {
        visibility: 'hidden'
    }

}));

export default function ReportBuilder(props) {
    // console.log('ReportBuilder')
    // console.log('props', props)

    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [selected, setSelected] = useState(2)
    const [expanded, setExpanded] = useState(["1"]); //
    const { staticContent,
        staticContent: { lookerContent },
        staticContent: { type },
        apiContent,
        action,
        activeTabValue,
        handleTabChange,
        lookerUser,
        sampleCode } = props;
    const sampleCodeTab = { type: 'sample code', label: 'Code', id: 'sampleCode', lookerUser, sampleCode }
    const tabContent = [...lookerContent, sampleCodeTab];
    const sharedFolderId = lookerContent[0].type === 'folder' ? lookerContent[0].id : '';

    let iFrameExists = $(".tabPanelContainer:visible iframe").length;
    let demoComponentType = type || 'sample code';
    let treeCounter = 0;

    const handleChange = (event, newValue) => {
        handleTabChange(newValue);
        setValue(newValue);
    };

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    }

    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds);
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
                    {iFrameExists ? '' :
                        <Grid item sm={12} >
                            {/* <Skeleton variant="rect" animation="wave" className={classes.skeleton} /> */}
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
                            {tabContent.map((tabContentItem, tabContentItemIndex) => (
                                <TabPanel
                                    key={`${validIdHelper(demoComponentType + '-tabPanel-' + tabContentItemIndex)}`}
                                    value={value}
                                    index={tabContentItemIndex}>
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
                                            tabContentItemIndex === 0
                                                ?
                                                <React.Fragment
                                                    key={`${validIdHelper(demoComponentType + '-outerFragment-' + tabContentItemIndex)}`}>
                                                    <Grid item sm={4} >

                                                        <TreeView
                                                            className={classes.tree}
                                                            defaultCollapseIcon={<ExpandMoreIcon />}
                                                            defaultExpandIcon={<ChevronRightIcon />}
                                                            expanded={expanded}
                                                            onNodeToggle={handleToggle}
                                                            onNodeSelect={handleSelect}
                                                        >
                                                            {Object.keys(apiContent).length ? Object.keys(apiContent).map((key, outerIndex) => (
                                                                <React.Fragment
                                                                    key={`${validIdHelper(demoComponentType + '-innerFragment-' + outerIndex)}`}>
                                                                    <TreeItem
                                                                        key={`${validIdHelper(demoComponentType + '-outerTreeItem-' + outerIndex)}`}
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
                                                                                        key={`${validIdHelper(demoComponentType + '-innerTreeItem-' + treeCounter)}`}
                                                                                        nodeId={"" + (treeCounter += 1)}
                                                                                        treecounter={treeCounter}
                                                                                        selected={selected === treeCounter}
                                                                                        className={selected === treeCounter ? `Mui-selected innerTreeItem` : `innerTreeItem`}
                                                                                        contentid={item.id}
                                                                                        label={item.folder_id === sharedFolderId && key === 'looks' ?

                                                                                            < div
                                                                                                id={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                                                                                                key={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                                                                                                className={`${classes.labelRoot} ${classes.parentHoverVisibility}`}>
                                                                                                {item.title}

                                                                                                <Button
                                                                                                    id={`${validIdHelper(demoComponentType + '-innerTreeItem-Explore' + treeCounter)}`}
                                                                                                    key={`${validIdHelper(demoComponentType + '-innerTreeItem-Explore' + treeCounter)}`}
                                                                                                    size="small"
                                                                                                    className={`${classes.ml24} ${classes.childHoverVisibility}`}
                                                                                                    onClick={(event) => {
                                                                                                        setSelected(treeCounter);
                                                                                                        action(
                                                                                                            key.substring(0, key.length - 1),
                                                                                                            item.id,
                                                                                                            'explore',
                                                                                                            item.client_id,
                                                                                                            tabContent[tabContentItemIndex + 1].id,
                                                                                                            validIdHelper(`embedContainer-${demoComponentType}-${tabContent[tabContentItemIndex + 1].id}`)
                                                                                                        );
                                                                                                        event.stopPropagation();
                                                                                                    }
                                                                                                    }
                                                                                                    color="default"
                                                                                                >
                                                                                                    Explore
                                                                                            </Button>
                                                                                            </div>
                                                                                            : key === 'looks' ?
                                                                                                <div
                                                                                                    id={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                                                                                                    key={`${validIdHelper(demoComponentType + '-innerTreeItem-LabelContainer' + treeCounter)}`}
                                                                                                    className={`${classes.labelRoot} ${classes.parentHoverVisibility}`}>
                                                                                                    {item.title}
                                                                                                    <Button
                                                                                                        id={`${validIdHelper(demoComponentType + '-innerTreeItem-EditButton' + treeCounter)}`}
                                                                                                        key={`${validIdHelper(demoComponentType + '-innerTreeItem-EditButton' + treeCounter)}`}
                                                                                                        size="small"
                                                                                                        className={`${classes.ml24} ${classes.childHoverVisibility}`} //
                                                                                                        onClick={(event) => {
                                                                                                            setSelected(treeCounter);
                                                                                                            action(
                                                                                                                key.substring(0, key.length - 1),
                                                                                                                item.id,
                                                                                                                'edit',
                                                                                                                item.client_id,
                                                                                                                tabContent[tabContentItemIndex + 1].id,
                                                                                                                validIdHelper(`embedContainer-${demoComponentType}-${tabContent[tabContentItemIndex + 1].id}`)
                                                                                                            );
                                                                                                            event.stopPropagation();
                                                                                                        }
                                                                                                        }
                                                                                                        color="primary"
                                                                                                    >
                                                                                                        Edit
                                                                                            </Button>
                                                                                                    <Button
                                                                                                        id={`${validIdHelper(demoComponentType + '-innerTreeItem-DeleteButton' + treeCounter)}`}
                                                                                                        key={`${validIdHelper(demoComponentType + '-innerTreeItem-DeleteButton' + treeCounter)}`}
                                                                                                        size="small"
                                                                                                        className={`${classes.ml24} ${classes.childHoverVisibility}`} //
                                                                                                        onClick={(event) => {
                                                                                                            setSelected(treeCounter);
                                                                                                            action(
                                                                                                                key.substring(0, key.length - 1),
                                                                                                                item.id,
                                                                                                                'delete',
                                                                                                                item.client_id,
                                                                                                                tabContent[tabContentItemIndex + 1].id,
                                                                                                                validIdHelper(`embedContainer-${demoComponentType}-${tabContent[tabContentItemIndex + 1].id}`)
                                                                                                            );
                                                                                                            event.stopPropagation();
                                                                                                        }
                                                                                                        }
                                                                                                        color="secondary"
                                                                                                    >
                                                                                                        Delete
                                                                                            </Button>
                                                                                                </div>
                                                                                                : item.title
                                                                                        }
                                                                                        onClick={() => {
                                                                                            setSelected(treeCounter)
                                                                                            action(
                                                                                                key.substring(0, key.length - 1), item.id)
                                                                                        }} />

                                                                                ))
                                                                                :
                                                                                ''
                                                                        }
                                                                    </TreeItem>

                                                                </React.Fragment>
                                                            )) : ''}
                                                        </TreeView>
                                                    </Grid>
                                                    <Grid item sm={8} >
                                                        <div
                                                            className="embedContainer"
                                                            id={validIdHelper(`embedContainer-${demoComponentType}-${tabContentItem.id}`)}
                                                            key={validIdHelper(`embedContainer-${demoComponentType}-${tabContentItem.id}`)}
                                                        >
                                                        </div>
                                                    </Grid>
                                                </React.Fragment>
                                                :
                                                <Grid item sm={12} >
                                                    <div
                                                        className="embedContainer"
                                                        id={validIdHelper(`embedContainer-${demoComponentType}-${tabContentItem.id}`)}
                                                        key={validIdHelper(`embedContainer-${demoComponentType}-${tabContentItem.id}`)}
                                                    >
                                                    </div>
                                                </Grid>
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