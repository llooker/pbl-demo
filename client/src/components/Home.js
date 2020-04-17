import React, { Component } from 'react'

//material
import clsx from 'clsx';
// import { makeStyles, useTheme } from '@material-ui/core/styles';
import { withStyles } from "@material-ui/core/styles";
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';


import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import HomeIcon from '@material-ui/icons/Home';
import FilterListIcon from '@material-ui/icons/FilterList';
import LinkIcon from '@material-ui/icons/Link';
import GavelIcon from '@material-ui/icons/Gavel';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import BuildIcon from '@material-ui/icons/Build';

import UserMenu from './Material/UserMenu';
import TabPanel from './Material/TabPanel';

import UsecaseContent from '../usecaseContent.json';

// constants
const drawerWidth = 240;
const { validIdHelper } = require('../tools'); //a11yProps

function a11yProps(index) {
    // console.log('a11yProps')
    // console.log('index', index)
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    title: {
        flexGrow: 1,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
});


class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            value: 0
        }
    }

    handleChange = (event, newValue) => {
        this.setState({
            value: newValue
        })
    };

    //these could be combined??
    handleDrawerOpen = () => {
        // setOpen(true);
        this.setState({
            open: true,
        })
    };

    handleDrawerClose = () => {
        this.setState({
            open: false
        })
    };



    render() {

        // const classes = useStyles();
        // const theme = useTheme();
        const iconMap = {
            "splash page": HomeIcon,
            "custom filter": FilterListIcon,
            "dashboard overview detail": LinkIcon,
            "report builder": GavelIcon,
            "query builder": QueryBuilderIcon,
            "custom viz": BuildIcon
        }
        const { value, open } = this.state
        const { handleDrawerOpen, handleDrawerClose, handleChange } = this
        const { classes, activeCustomization } = this.props

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap className={classes.title}>
                            {activeCustomization.companyName}
                        </Typography>
                        <UserMenu />
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            {/* {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />} */}
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        className={classes.tabs}
                    >

                        {UsecaseContent.marketing.demoComponents.map((item, index) => (

                            <Tab label={item.label}
                                icon={React.createElement(iconMap[item.type])}
                                {...a11yProps(index)}
                                wrapped="true"></Tab>


                        ))
                        }
                    </Tabs>
                </Drawer>
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <div className={classes.drawerHeader} />

                    {UsecaseContent.marketing.demoComponents.map((item, index) => (

                        <TabPanel value={value} index={index}>
                            {index}
                            {item.label}
                        </TabPanel>
                    ))
                    }
                </main>
            </div >
        )
    }
}
export default withStyles(styles)(Home);

