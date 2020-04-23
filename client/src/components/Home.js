import React, { Component } from 'react'

//material
import clsx from 'clsx';
import { withStyles } from "@material-ui/core/styles";
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
// import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Icon from '@material-ui/core/Icon';
import HomeIcon from '@material-ui/icons/Home';
import FilterListIcon from '@material-ui/icons/FilterList';
import LinkIcon from '@material-ui/icons/Link';
import GavelIcon from '@material-ui/icons/Gavel';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import BuildIcon from '@material-ui/icons/Build';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import UserMenu from './Material/UserMenu';

import $ from 'jquery';
import _ from 'lodash'

import { LookerEmbedSDK } from '@looker/embed-sdk'
import UsecaseContent from '../usecaseContent.json';
//demoComponents
import SplashPage from './Demo/SplashPage';
import CustomFilter from './Demo/CustomFilter';
import DashboardOverviewDetail from './Demo/DashboardOverviewDetail';
import ReportBuilder from './Demo/ReportBuilder';
import ComingSoon from './Demo/ComingSoon';
import CodeSideBar from './Demo/CodeSideBar';

// constants
const drawerWidth = 240;
const { validIdHelper } = require('../tools');


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}


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
    dNone: {
        display: 'none'
    },
    dBlock: {
        display: 'block'
    },
    relative: {
        position: 'relative'
    },
    absolute: {
        position: 'absolute'
    },
    right0: {
        right: 0
    },
    top0: {
        top: 0
    },
    right24: {
        right: 24
    },
    top24: {
        top: 24
    }
});


class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drawerOpen: false,
            drawerTabValue: 0,
            activeTabValue: 0,
            // renderSampleCode: false,
            sampleCode: {}
        }
    }

    //material  methods for layout
    handleDrawerTabChange = (event, newValue) => {
        // console.log('handleDrawerTabChange')
        // console.log('event.target', event.target)

        this.handleDrawerChange(true);

        if (newValue > 0) {

            const contenttype = $("#drawerTabs button")[newValue].getAttribute('contenttype')
            const sampleCodeFilePath = require(`../sample-code/${contenttype}.sample.txt`);
            fetch(sampleCodeFilePath)
                .then(response => {
                    return response.text()
                })
                .then(text => {
                    this.setState({
                        drawerTabValue: newValue,
                        sampleCode: text
                    }, () => {
                        this.handleTabChange(0)
                    })
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        } else {
            this.setState({
                drawerTabValue: newValue
            })
        }
    };

    handleTabChange = newValue => {
        this.setState({
            activeTabValue: newValue
        }, () => {
            // console.log('handleTabChange callback', this.state.activeTabValue)
        })
    }

    handleDrawerChange = (open) => {
        this.setState({
            drawerOpen: open
        })
    }

    componentDidMount(props) {
        // console.log('Home componentDidMount')
        LookerEmbedSDK.init(`${this.props.lookerHost}.looker.com`, '/auth');
        this.setupLookerContent(UsecaseContent.marketing.demoComponents);
    }

    // componentDidUpdate(prevProps) {
    //     console.log('LookerContent componentDidUpdate')
    //     this.setupLookerContent(UsecaseContent.marketing.demoComponents);
    // }

    // think about refactor to make more efficient 
    // promise.all()
    async setupLookerContent(usecaseContent) {
        // console.log('setupLookerContent')
        // console.log('usecaseContent', usecaseContent)

        //delete old content
        let embedContainerArray = document.getElementsByClassName("embedContainer");
        // console.log('embedContainerArray', embedContainerArray)
        for (let h = 0; h < embedContainerArray.length; h++) {
            let thisEmbedContainerId = embedContainerArray[h].id
            document.getElementById(thisEmbedContainerId).innerHTML = ''
        }


        let objForState = {}
        for (let j = 0; j < usecaseContent.length; j++) {
            for (let i = 0; i < usecaseContent[j].lookerContent.length; i++) {
                // let dashboardId = usecaseContent[j].lookerContent[i].id;
                if (usecaseContent[j].lookerContent[i].type === 'dashboard') {
                    LookerEmbedSDK.createDashboardWithId(usecaseContent[j].lookerContent[i].id)
                        .appendTo(validIdHelper(`#embedContainer${usecaseContent[j].lookerContent[i].id}`))
                        .withClassName('iframe')
                        .withNext()
                        .withTheme('Looker')
                        // .on('dashboard:run:start', (event) => console.log('event', event))
                        // .on('drillmenu:click', (event) => this.drillClick(event))
                        .on('drillmenu:click', (event) => this[_.camelCase(usecaseContent[j].type) + 'Action'](event))
                        // .on('dashboard:filters:changed', (e) => this.filtersUpdates(e))
                        .build()
                        .connect()
                        .then((dashboard) => {
                            // objForState[usecaseContent[j].lookerContent[i].id] = dashboard; //not working
                            this.setState({
                                [usecaseContent[j].lookerContent[i].id]: dashboard
                            })
                        })
                        .catch((error) => {
                            console.error('Connection error', error)
                        })

                    if (usecaseContent[j].lookerContent[i].hasOwnProperty('customDropdown')) {

                        let stringifiedQuery = encodeURIComponent(JSON.stringify(usecaseContent[j].lookerContent[i].customDropdown.inlineQuery))
                        let lookerResponse = await fetch('/runinlinequery/' + stringifiedQuery + '/json', {
                            method: 'GET',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json'
                            }
                        })
                        let lookerResponseData = await lookerResponse.json();

                        let inlineQueryField = usecaseContent[j].lookerContent[i].customDropdown.inlineQuery.fields[0]
                        for (i = 0; i < lookerResponseData.queryResults.length; i++) {
                            lookerResponseData.queryResults[i].label = lookerResponseData.queryResults[i][inlineQueryField];
                            delete lookerResponseData.queryResults[i][inlineQueryField];
                        }

                        const stateKey = _.camelCase(usecaseContent[j].type) + 'ApiContent';
                        objForState[stateKey] = lookerResponseData.queryResults;
                    }

                } else if (usecaseContent[j].lookerContent[i].type === 'explore') {

                    LookerEmbedSDK.createExploreWithId(usecaseContent[j].lookerContent[i].id)
                        .appendTo(validIdHelper(`#embedContainer${usecaseContent[j].lookerContent[i].id}`))
                        .withClassName('iframe')
                        .on('explore:state:changed', (event) => {
                            // console.log('explore:state:changed')
                            // console.log('event', event)
                        })
                        .build()
                        .connect()
                        .then(this.setupExplore)
                        .catch((error) => {
                            console.error('Connection error', error)
                        })

                } else if (usecaseContent[j].lookerContent[i].type === 'folder') {

                    let lookerResponse = await fetch('/fetchfolder/' + usecaseContent[j].lookerContent[i].id, { //+ usecaseContent[j].type + '/'
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        }
                    })

                    let lookerResponseData = await lookerResponse.json();
                    let looksToUse = [...lookerResponseData.sharedFolder.looks, ...lookerResponseData.embeddedUserFolder.looks]
                    let dashboardsToUse = [...lookerResponseData.sharedFolder.dashboards]
                    let objToUse = {
                        looks: looksToUse,
                        dashboards: dashboardsToUse
                    }

                    {
                        objToUse.looks.length ?
                            objToUse.looks.map((item, index) => {
                                let lookId = item.id
                                LookerEmbedSDK.createLookWithId(lookId)
                                    .appendTo(validIdHelper(`#embedContainer${usecaseContent[j].lookerContent[i].id}`))
                                    .withClassName('iframe')
                                    .withClassName('look')
                                    .withClassName(lookerResponseData.sharedFolder.looks.indexOf(item) > -1 ? "shared" : "personal")
                                    .withClassName(index > 0 ? 'd-none' : 'oops')
                                    .withClassName(lookId)
                                    // .on('drillmenu:click', (e) => this.drillClick(e))
                                    .on('drillmodal:look', (event) => {
                                        // console.log('drillmodal:explore')
                                        // console.log('event', event)
                                    })
                                    .build()
                                    .connect()
                                    .then(this.setupLook)
                                    .catch((error) => {
                                        console.error('Connection error', error)
                                    })
                            }) : ''
                    }

                    {
                        objToUse.dashboards.length ? objToUse.dashboards.map((item, index) => {
                            let dashboardId = item.id
                            LookerEmbedSDK.createDashboardWithId(dashboardId)
                                .appendTo(validIdHelper(`#embedContainer${usecaseContent[j].lookerContent[i].id}`))
                                .withClassName('iframe')
                                .withClassName('dashboard')
                                .withClassName(lookerResponseData.sharedFolder.dashboard.indexOf(item) > -1 ? "shared" : "personal")
                                // .on('drillmenu:click', (e) => this.drillClick(e))
                                .build()
                                .connect()
                                .then(this.setupLook)
                                .catch((error) => {
                                    console.error('Connection error', error)
                                })
                        }) : ''
                    }

                    const stateKey = _.camelCase(usecaseContent[j].type) + 'ApiContent';
                    objForState[stateKey] = objToUse; //[...looksToUse, ...dashboardsToUse]; //objToUse;
                }
                else if (usecaseContent[j].lookerContent[i].type === "api") {
                    let lookerResposnse = await fetch('/runquery/' + usecaseContent[j].lookerContent[i].id + '/' + usecaseContent[j].lookerContent[i].resultFormat, {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        }
                    })
                    let lookerResponseData = await lookerResposnse.json();


                    const stateKey = _.camelCase(usecaseContent[j].type) + 'ApiContent';
                    // this gives better performance...
                    // this.setState((prevState) => ({
                    //     [stateKey]: prevState[stateKey] ? [...prevState[stateKey], lookerResponseData] : [lookerResponseData]
                    // }))

                    //use state for this for now for better loading experience
                    if (objForState.hasOwnProperty(stateKey)) {
                        objForState[stateKey].push(lookerResponseData)
                    } else {
                        objForState[stateKey] = [lookerResponseData]
                    }
                }
            }

        }

        // set state once after loop to reduce renders
        //not working, or is it???
        setTimeout(() => {
            // console.log('objForState', objForState)
            this.setState((prevState) => ({
                ...prevState,
                ...objForState
            }), () => {
                // console.log('setState callback', this.state)
            })
        }, 1000)
    }

    customFilterAction = (event, stateName, filterName) => {
        // console.log('customFilterAction')
        // console.log('event', event)
        // console.log('event.target.value', event.target.innerText)
        // console.log('stateName', stateName)
        // console.log('filterName', filterName)

        this.setState({}, () => {
            this.state[stateName].updateFilters({ [filterName]: event.target.innerText })
            this.state[stateName].run()
        })

    }

    //seemes to be non performant, need to think of a new solution...
    reportBuilderAction = (contentId) => {
        // console.log('reportBuilderAction')
        // console.log('contentId', contentId)

        // const desiredContentId = event.target.getAttribute("contentid");
        // console.log('desiredContentId', desiredContentId);

        let iFrameArray = $(".embedContainer:visible > iframe")
        // console.log('000 iFrameArray', iFrameArray)
        for (let i = 0; i < iFrameArray.length; i++) {
            if (iFrameArray[i].classList.contains(contentId)) {
                // console.log('inside ifff')
                iFrameArray[i].classList.remove('d-none')
            } else {
                // console.log('inside elllse');
                iFrameArray[i].classList.add('d-none')
            }
        }
        // console.log('111 iFrameArray', iFrameArray)
    }


    // drillClick(event) {
    dashboardOverviewDetailAction(event) {
        // console.log('drillClick')
        // console.log('dashboardOverviewDetailAction')
        // console.log('event', event)
        const isCampaignPerformanceDrill = (event.label === 'Campaign Performance Dashboard') ? true : false
        if (isCampaignPerformanceDrill) {

            // const parsedUrl = new URL(event.url)
            // const stateName = decodeURIComponent(parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf('/') + 1, parsedUrl.pathname.length))
            // const filterName = decodeURIComponent(parsedUrl.search.substring(1, parsedUrl.search.indexOf('=')))
            // const filterValue = decodeURIComponent(parsedUrl.search.substring(parsedUrl.search.indexOf('=') + 1, parsedUrl.search.length))

            const url = event.url;
            let stateName = decodeURIComponent(url.substring(url.lastIndexOf('/') + 1, url.indexOf('?')));
            const filterName = decodeURIComponent(url.substring(url.indexOf('?') + 1, url.indexOf('=')));
            const filterValue = decodeURIComponent(url.substring(url.lastIndexOf('=') + 1, url.length));


            if (stateName === 'pwSkck3zvGd1fnhCO7Fc12') stateName = 3106; // hack for now...
            //urls changed to relative, need slugs to work across instances?

            // console.log('stateName', stateName)
            // console.log('filterName', filterName)
            // console.log('filterValue', filterValue)

            // console.log('this.state', this.state)

            this.setState({}, () => {
                this.state[stateName].updateFilters({ [filterName]: filterValue })
                this.state[stateName].run()
            })

            this.handleTabChange(1) //can assume one for now

            return { cancel: (isCampaignPerformanceDrill) ? true : false }
        }
    }

    // toggleCodeBar = () => {
    //     this.setState(prevState => ({
    //         renderSampleCode: prevState.renderSampleCode ? false : true
    //     }))
    // }

    render() {
        // console.log('Home render');
        // console.log('this.state', this.state);
        // console.log('this.props', this.props);


        // const iconMap = {
        //     "splash page": HomeIcon,
        //     "custom filter": FilterListIcon,
        //     "dashboard overview detail": LinkIcon,
        //     "report builder": GavelIcon,
        //     "query builder": QueryBuilderIcon,
        //     "custom viz": BuildIcon
        // }


        const demoComponentMap = {
            "splash page": SplashPage,
            "custom filter": CustomFilter,
            "dashboard overview detail": DashboardOverviewDetail,
            "report builder": ReportBuilder,
            // "query builder": ComingSoon,
            // "custom viz": ComingSoon
        }

        const { drawerTabValue, drawerOpen, activeTabValue, sampleCode } = this.state; //renderSampleCode
        const { handleDrawerChange, handleDrawerTabChange, handleTabChange } = this; //toggleCodeBar
        const { classes, activeCustomization, switchLookerUser, lookerUser, applySession } = this.props

        // console.log('drawerTabValue', drawerTabValue);
        // console.log('sampleCode', sampleCode);

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: drawerOpen,
                    })}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={() => handleDrawerChange(true)}
                            edge="start"
                            className={clsx(classes.menuButton, drawerOpen && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap className={classes.title}>
                            {/* {activeCustomization.companyName} */}
                            Atom Fashion
                        </Typography>
                        <UserMenu switchLookerUser={switchLookerUser} lookerUser={lookerUser} onLogoutSuccess={applySession} />
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={drawerOpen}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={() => handleDrawerChange(false)}>
                            {/* {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />} */}
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <Tabs
                        id="drawerTabs"
                        orientation="vertical"
                        variant="scrollable"
                        value={drawerTabValue}
                        onChange={handleDrawerTabChange}
                        aria-label="Vertical tabs example"
                        className={classes.tabs}
                    >

                        {UsecaseContent.marketing.demoComponents.map((item, index) => (

                            <Tab label={item.label}
                                key={`homeVerticalTabs${index}`}
                                icon={<Icon className={`fa ${item.icon} ${classes.icon}`} />}
                                {...a11yProps(index)}
                                contenttype={validIdHelper(item.type)}
                            ></Tab>


                        ))
                        }
                    </Tabs>
                </Drawer>
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: drawerOpen,
                    })}
                >


                    <div className={classes.drawerHeader} />

                    {
                        UsecaseContent.marketing.demoComponents.map((item, index) => {
                            const DemoComponent = demoComponentMap[item.type];
                            return (
                                <TabPanel
                                    key={validIdHelper(`tab-panel-${item.type}`)}
                                    value={drawerTabValue}
                                    index={index}
                                    className={classes.relative}
                                >

                                    {DemoComponent ?
                                        <DemoComponent key={validIdHelper(`list-${item.type}`)}
                                            staticContent={item}
                                            handleDrawerTabChange={handleDrawerTabChange}
                                            apiContent={this.state[_.camelCase(item.type) + 'ApiContent'] || []}
                                            action={typeof this[_.camelCase(item.type) + 'Action'] === 'function' ? this[_.camelCase(item.type) + 'Action'] : ''}
                                            activeTabValue={activeTabValue}
                                            handleTabChange={handleTabChange}
                                            lookerUser={lookerUser}
                                            sampleCode={sampleCode}
                                        /> :
                                        item.label
                                    }

                                    {/* {renderSampleCode ?
                                        <div className={`${classes.absolute} ${classes.right24} ${classes.top24}`}>
                                            <CodeSideBar lookerUser={lookerUser} />
                                        </div>
                                        : ''} */}


                                </TabPanel>)
                        })
                    }
                </main >
            </div >
        )
    }
}
export default withStyles(styles)(Home);

