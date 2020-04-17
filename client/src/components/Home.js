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
import HomeIcon from '@material-ui/icons/Home';
import FilterListIcon from '@material-ui/icons/FilterList';
import LinkIcon from '@material-ui/icons/Link';
import GavelIcon from '@material-ui/icons/Gavel';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import BuildIcon from '@material-ui/icons/Build';
import UserMenu from './Material/UserMenu';
import TabPanel from './Material/TabPanel';

import $ from 'jquery';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import UsecaseContent from '../usecaseContent.json';
//demoComponents
import SplashPage from './Demo/SplashPage';
import CustomFilter from './Demo/CustomFilter';
import DashboardOverviewDetail from './Demo/DashboardOverviewDetail';
import ReportBuilder from './Demo/ReportBuilder';
import ComingSoon from './Demo/ComingSoon';
import CodeSideBar from './CodeSideBar';



// constants
const drawerWidth = 240;
const { validIdHelper, a11yProps } = require('../tools');


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
            value: 0,
            splashPageContent: [],
            customDropdownOptions: [],
            reportBuilderContent: {}
        }
    }

    //material  methods for layout
    handleChange = (event, newValue) => {
        this.setState({
            value: newValue
        })
    };

    handleDrawer = (open) => {
        this.setState({
            open
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

    async setupLookerContent(usecaseContent) {
        // console.log('setupLookerContent')
        // console.log('usecaseContent', usecaseContent)

        //delete old content..?
        let embedContainerArray = document.getElementsByClassName("embedContainer");
        // console.log('embedContainerArray', embedContainerArray)
        for (let h = 0; h < embedContainerArray.length; h++) {
            let thisEmbedContainerId = embedContainerArray[h].id
            document.getElementById(thisEmbedContainerId).innerHTML = ''
        }

        let objForState = {}
        for (let j = 0; j < usecaseContent.length; j++) {
            // for (let j = 0; j < 2; j++) {
            for (let i = 0; i < usecaseContent[j].lookerContent.length; i++) {
                if (usecaseContent[j].lookerContent[i].type === 'dashboard') {

                    LookerEmbedSDK.createDashboardWithId(usecaseContent[j].lookerContent[i].id)
                        .appendTo(validIdHelper(`#embedContainer${usecaseContent[j].lookerContent[i].id}`))
                        .withClassName('iframe')
                        .withNext()
                        .withTheme('Looker') //new
                        .on('dashboard:run:start', (e) => {
                            // console.log('e', e)
                        })
                        .on('drillmenu:click', (e) => this.drillClick(e))
                        // .on('dashboard:filters:changed', (e) => this.filtersUpdates(e))
                        .build()
                        .connect()
                        .then((dashboard) => {
                            // this.setState({
                            //     [usecaseContent[j].lookerContent[i].id]: dashboard //5277
                            // })
                            objForState[usecaseContent[j].lookerContent[i].id] = dashboard;
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
                        // this.setState({
                        //     customDropdownOptions: lookerResponseData.queryResults
                        // })
                        objForState['customDropdownOptions'] = lookerResponseData.queryResults;
                    }
                } else if (usecaseContent[j].lookerContent[i].type === 'explore') {
                    LookerEmbedSDK.createExploreWithId(usecaseContent[j].lookerContent[i].id)
                        .appendTo(validIdHelper(`#embedContainer${usecaseContent[j].lookerContent[i].id}`))
                        .withClassName('iframe')
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
                                    .on('drillmenu:click', (e) => this.drillClick(e))
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
                                .on('drillmenu:click', (e) => this.drillClick(e))
                                .build()
                                .connect()
                                .then(this.setupLook)
                                .catch((error) => {
                                    console.error('Connection error', error)
                                })
                        }) : ''
                    }

                    // this.setState({
                    //     reportBuilderContent: objToUse
                    // }, () => {
                    //     // console.log('setState callback ', this.state.reportBuilderContent)
                    // })

                    objForState['reportBuilderContent'] = objToUse;
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
                    // this.setState((prevState) => ({
                    //     splashPageContent: [...prevState.splashPageContent, lookerResponseData]
                    // }), () => {
                    //     // console.log('usecaseContent api callback')
                    //     // console.log('this.state.splashPageContent', this.state.splashPageContent)
                    // })

                    if (objForState.hasOwnProperty('splashPageContent')) {
                        objForState['splashPageContent'].push(lookerResponseData)
                    } else {
                        objForState['splashPageContent'] = [lookerResponseData]
                    }
                }
            }

        }
        //set state once after loop to reduce renders
        this.setState({
            ...objForState
        })

    }

    dropdownSelect = (e) => {
        const targetId = e.target.id
        const dashboardStateName = e.target.getAttribute("dashboardstatename");
        const dropdownFilterName = e.target.getAttribute("dropdownfiltername");
        this.setState({
            [targetId]: e.target.value
        }, () => {
            this.state[dashboardStateName].updateFilters({ [dropdownFilterName]: this.state[targetId] })
            this.state[dashboardStateName].run()
        })
    }

    setActiveTab = (tabIndex) => {
        // console.log('setActiveTab')
        // console.log('tabIndex', tabIndex)

        if (this.state.renderSampleCode) this.toggleCodeBar();

        let tabsArray = $(".parentTabList:visible a");
        let contentArray = $(".parentTabContent:visible > div");
        // console.log('tabsArray', tabsArray);
        // console.log('contentArray', contentArray);

        //simulate tab change, when looker action taken...
        if (!$(tabsArray[tabIndex]).hasClass('active')) {
            for (let i = 0; i < tabsArray.length; i++) {
                if (i === tabIndex) {
                    tabsArray[i].className = "nav-link active "
                    contentArray[i].className = "tab-pane fade show active"
                } else {
                    tabsArray[i].className = "nav-link"
                    contentArray[i].className = "tab-pane fade"
                }
            }
        }

        let newTabContentType = $(tabsArray[tabIndex]).attr('contenttype');
        // console.log('newTabContentType', newTabContentType)
        if (newTabContentType) {
            this.setState({
                activeTabType: newTabContentType
            }, () => {
                const sampleCodeFilePath = require(`../sample-code/${newTabContentType}.sample.txt`);
                fetch(sampleCodeFilePath)
                    .then(response => {
                        return response.text()
                    })
                    .then(text => {
                        this.setState({
                            sampleCode: text
                        })
                    })
            })
        }
    }

    drillClick(event) {
        // console.log('drillClick')
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

            this.state[stateName].updateFilters({ [filterName]: filterValue })
            this.state[stateName].run()

            this.setActiveTab(1)

            return { cancel: (isCampaignPerformanceDrill) ? true : false }
        }
    }



    render() {
        // console.log('Home render');
        // console.log('this.state', this.state);


        const iconMap = {
            "splash page": HomeIcon,
            "custom filter": FilterListIcon,
            "dashboard overview detail": LinkIcon,
            "report builder": GavelIcon,
            "query builder": QueryBuilderIcon,
            "custom viz": BuildIcon
        }


        const demoComponentMap = {
            "splash page": SplashPage,
            "custom filter": CustomFilter,
            "dashboard overview detail": DashboardOverviewDetail,
            "report builder": ReportBuilder,
            "query builder": ComingSoon,
            "custom viz": ComingSoon
        }

        const { value, open,
            splashPageContent, reportBuilderContent, customDropdownOptions } = this.state
        const { handleDrawerOpen, handleDrawerClose, handleDrawer, handleChange, dropdownSelect, setActiveTab } = this
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
                            onClick={() => handleDrawer(true)}
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
                        <IconButton onClick={() => handleDrawer(false)}>
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

                    {UsecaseContent.marketing.demoComponents.map((item, index) => {
                        const DemoComponent = demoComponentMap[item.type];
                        return (
                            <TabPanel value={value} index={index}>

                                {DemoComponent ? <DemoComponent key={validIdHelper(`list-${item.type}`)}
                                    lookerContent={item.lookerContent}
                                    setActiveTab={setActiveTab}
                                    handleChange={handleChange}
                                    dropdownSelect={dropdownSelect}
                                    demoComponentType={item.type}
                                    splashPageContent={splashPageContent}
                                    customDropdownOptions={customDropdownOptions}
                                    reportBuilderContent={reportBuilderContent}
                                /> : <>
                                        {index}
                                        {item.label}</>}

                            </TabPanel>)
                    })
                    }
                </main>
            </div >
        )
    }
}
export default withStyles(styles)(Home);

