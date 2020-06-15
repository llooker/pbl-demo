
import $ from 'jquery';
import _ from 'lodash'
import React, { Component } from 'react'
import clsx from 'clsx';
import { withStyles } from "@material-ui/core/styles";
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar'
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { blue, green, orange, indigo, red, grey } from '@material-ui/core/colors';

//fabio suggestion 6/12
//look at dynamic importing + code splitting to further optimize load
//https://github.com/fabio-looker/cs-app-internal/blob/master/extension/src/index.js lines ~34
//https://github.com/fabio-looker/cs-app-internal/blob/master/extension/src/main.jsx lines 11, 54
//https://github.com/fabio-looker/cs-app-internal/blob/master/extension/webpack.config.js output line
import UserMenu from './Material/UserMenu';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import UsecaseContent from '../usecaseContent.json';
import SplashPage from './Demo/SplashPage';
import Dashboard from './Demo/Dashboard/Dashboard';
import CustomVis from './Demo/CustomVis/CustomVis';
import ReportBuilder from './Demo/ReportBuilder/ReportBuilder';
import QueryBuilder from './Demo/QueryBuilder/QueryBuilder';
import ComingSoon from './Demo/ComingSoon';



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
    },
    ml12: {
        marginLeft: 12
    }
});

const defaultTheme = createMuiTheme({})
const atomTheme = createMuiTheme({
    palette: {
        primary: {
            main: grey[900],
        },
        secondary: {
            main: grey[400],
        },
    },
})

const vidlyTheme = createMuiTheme({
    palette: {
        primary: {
            main: blue[500],
        },
    },
})

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerOpen: true,
            drawerTabValue: 0,
            activeTabValue: 0,
            sampleCode: {},
            activeUsecase: '',
            appLayout: ''
        }
    }

    handleDrawerTabChange = (event, newValue) => {
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
            }, () => {
                this.handleTabChange(0)
            })
        }
    };

    handleTabChange = newValue => {
        this.setState({
            activeTabValue: newValue
        })
    }

    handleDrawerChange = (open) => {
        this.setState({
            drawerOpen: open
        })
    }

    componentDidMount(props) {
        let usecaseFromUrl = window.location.pathname.replace(/^\/([^\/]*).*$/, '$1');
        this.setState({
            activeUsecase: usecaseFromUrl,
            appLayout: UsecaseContent[usecaseFromUrl].layout || 'left-sidebar'
        }, () => {
            LookerEmbedSDK.init(`${this.props.lookerHost}.looker.com`, '/auth');
        })
    }

    //needs to be rebuilt
    /*splashPageDetail = async (sharedUrl, index) => {
        // console.log('splashPageDetail')
        // console.log('sharedUrl', sharedUrl)
        // console.log('index', index)
        let parsedUrl = new URL(`https://${this.props.lookerHost}.looker.com${sharedUrl}`);
        let splashPageApiContentCopy;
        if (parsedUrl.pathname.split('/')[1] === "explore") {
            let filters = parsedUrl.search.match(/(?<=&f\[).+?(?=\])/g);
            let filtersObj = {}
            filters.forEach(item => {
                filtersObj[item] = parsedUrl.searchParams.get(`f[${item}]`)
            })
            let newQueryParams = {
                model: parsedUrl.pathname.split('/')[2],
                view: parsedUrl.pathname.split('/')[3],
                fields: parsedUrl.searchParams.get("fields").split(","),
                filters: filtersObj,
                total: true,
                limit: "25"
            }

            // console.log('newQueryParams', newQueryParams)

            let lookerResponse = await fetch('/runinlinequery/' + JSON.stringify(newQueryParams) + '/json', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            let lookerResponseData = await lookerResponse.json();
            splashPageApiContentCopy = [...this.state.splashPageApiContent]
            splashPageApiContentCopy[index].detail = lookerResponseData.queryResults;

        } else {
            splashPageApiContentCopy = [...this.state.splashPageApiContent]
            splashPageApiContentCopy[index].detail = [];
        }
        this.setState({
            splashPageApiContent: splashPageApiContentCopy
        })
    }*/

    /*runQueryDetail = async (sharedUrl, index) => {
        // console.log('runQueryDetail')
        console.log('sharedUrl', sharedUrl)
        console.log('index', index)
        let parsedUrl = new URL(`https://${this.props.lookerHost}.looker.com${sharedUrl}`);
        let splashPageApiContentCopy;
        if (parsedUrl.pathname.split('/')[1] === "explore") {
            let filters = parsedUrl.search.match(/(?<=&f\[).+?(?=\])/g);
            let filtersObj = {}
            filters.forEach(item => {
                filtersObj[item] = parsedUrl.searchParams.get(`f[${item}]`)
            })
            let newQueryParams = {
                model: parsedUrl.pathname.split('/')[2],
                view: parsedUrl.pathname.split('/')[3],
                fields: parsedUrl.searchParams.get("fields").split(","),
                filters: filtersObj,
                total: true,
                limit: "25"
            }
     
            // console.log('newQueryParams', newQueryParams)
     
            let lookerResponse = await fetch('/runinlinequery/' + JSON.stringify(newQueryParams) + '/json', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            let lookerResponseData = await lookerResponse.json();
            splashPageApiContentCopy = [...this.state.splashPageApiContent]
            splashPageApiContentCopy[index].detail = lookerResponseData.queryResults;
     
        } else {
            splashPageApiContentCopy = [...this.state.splashPageApiContent]
            splashPageApiContentCopy[index].detail = [];
        }
        this.setState({
            splashPageApiContent: splashPageApiContentCopy
        })
     
    }*/

    /*dashboardOverviewDetailAction(event) {
        // console.log('dashboardOverviewDetailAction')
        // console.log('event', event)
        if (event.label === 'Campaign Performance Dashboard') { //ecommm
            const url = event.url;
            let stateName = decodeURIComponent(url.substring(url.lastIndexOf('/') + 1, url.indexOf('?')));
            const filterName = decodeURIComponent(url.substring(url.indexOf('?') + 1, url.indexOf('=')));
            const filterValue = decodeURIComponent(url.substring(url.lastIndexOf('=') + 1, url.length));
            if (stateName === 'pwSkck3zvGd1fnhCO7Fc12') stateName = 3106; // hack for now...
            this.setState({}, () => {
                this.state[stateName].updateFilters({ [filterName]: filterValue })
                this.state[stateName].run()
            })

            this.handleTabChange(1) //can assume one for now
            return { cancel: true }
        } else if (event.label === "Condition Lookup Dashboard") { //insurance
            const url = event.url;
            let stateName = decodeURIComponent(url.substring(url.lastIndexOf('/') + 1, url.indexOf('?')));
            const filterName = decodeURIComponent(url.substring(url.indexOf('?') + 1, url.indexOf('=')));
            const filterValue = decodeURIComponent(url.substring(url.lastIndexOf('=') + 1, url.length));
            if (stateName === 'TU4SBUVLvW1gDzfwCms2ji') stateName = 286; // hack for now...
            this.setState({}, () => {
                this.state[stateName].updateFilters({ [filterName]: filterValue })
                this.state[stateName].run()
            })
            this.handleTabChange(1) //can assume one for now
            return { cancel: true }
        }
    }*/

    /*cohortBuilderAction = async (lookerContent) => {
        // console.log('cohortBuilderAction');
        // console.log('lookerContent', lookerContent);
    
    
        let cohortBuilderApiContentCopy = { ...this.state.cohortBuilderApiContent }
        cohortBuilderApiContentCopy.status = 'running';
        cohortBuilderApiContentCopy.filterContent = {};
        // this.setState({ 'cohortBuilderApiContent': cohortBuilderApiContentCopy })
    
        for (let i = 0; i < lookerContent.fields.length; i++) {
    
            let newQuery = lookerContent.queryBody;
            newQuery.fields = [lookerContent.fields[i]];
            // console.log('newQuery', newQuery);
    
    
            let lookerCreateTaskResposnse = await fetch('/createquerytask/' + JSON.stringify(newQuery), {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            let lookerCreateTaskResponseData = await lookerCreateTaskResposnse.json();
            // console.log('lookerCreateTaskResponseData', lookerCreateTaskResponseData);
    
            let taskInterval = setInterval(async () => {
                let lookerCheckTaskResposnse = await fetch('/checkquerytask/' + lookerCreateTaskResponseData.queryTaskId, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                let lookerCheckTaskResponseData = await lookerCheckTaskResposnse.json();
    
                if (lookerCheckTaskResponseData.queryResults.status === 'complete') {
                    clearInterval(taskInterval)
    
                    lookerCheckTaskResponseData.queryResults.options = []
                    for (let j = 0; j < lookerCheckTaskResponseData.queryResults.data.length; j++) {
                        let thisOption = {};
                        thisOption.label = lookerCheckTaskResponseData.queryResults.data[j][lookerCheckTaskResponseData.queryResults.added_params.sorts[0]].value == null
                            ? '' :
                            lookerCheckTaskResponseData.queryResults.data[j][lookerCheckTaskResponseData.queryResults.added_params.sorts[0]].value
                        lookerCheckTaskResponseData.queryResults.options.push(thisOption)
                    }
    
                    cohortBuilderApiContentCopy.filterContent[lookerCheckTaskResponseData.queryResults.id] = lookerCheckTaskResponseData.queryResults
                    cohortBuilderApiContentCopy.status = Object.keys(cohortBuilderApiContentCopy.filterContent).length === lookerContent.fields.length ? "complete" : "running";
                    this.setState((prevState) => ({
                        'cohortBuilderApiContent': cohortBuilderApiContentCopy
                    }))
                }
            }, 1000)
    
        }
        // console.log('cohortBuilderApiContentCopy', cohortBuilderApiContentCopy)
        // this.setState({
        //     cohortBuilderApiContent: cohortBuilderApiContentCopy
        // })
    
    }*/

    render() {
        //why are these different?
        const demoComponentMap = {
            "splash page": SplashPage,
            "simple dashboard": Dashboard,
            "custom filter": Dashboard,
            "custom vis": CustomVis,
            "report builder": ReportBuilder,
            "query builder": QueryBuilder
        }

        const themeMap = {
            "atom": atomTheme,
            "vidly": vidlyTheme
        }

        const { drawerTabValue, drawerOpen, activeTabValue, sampleCode, activeUsecase } = this.state;
        const { handleDrawerChange, handleDrawerTabChange, handleTabChange } = this;
        const { classes, activeCustomization, switchLookerUser, lookerUser, applySession, lookerUserAttributeBrandOptions, switchUserAttributeBrand } = this.props

        // console.log('activeUsecase', activeUsecase)

        return (
            <div className={classes.root}>
                <ThemeProvider theme={activeUsecase ? themeMap[activeUsecase] : defaultTheme}>
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

                            {activeUsecase ?
                                <Avatar alt="Icon"
                                    src={require(`../images/${activeUsecase}_logo.png`)}
                                /> : ''}

                            <Typography variant="h6" noWrap className={`${classes.title} ${classes.ml12}`}>
                                {activeUsecase ? UsecaseContent[activeUsecase].vignette.name : ''}
                            </Typography>
                            <UserMenu
                                lookerUser={lookerUser}
                                switchLookerUser={switchLookerUser}
                                onLogoutSuccess={applySession}
                                lookerUserAttributeBrandOptions={lookerUserAttributeBrandOptions}
                                switchUserAttributeBrand={switchUserAttributeBrand}
                            />
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
                            {activeUsecase ? UsecaseContent[activeUsecase].demoComponents.map((item, index) => (
                                <Tab label={item.label}
                                    id={`homeVerticalTabs${index}`}
                                    key={`homeVerticalTabs${index}`}
                                    icon={<Icon className={`fa ${item.icon} ${classes.icon}`} />}
                                    {...a11yProps(index)}
                                    contenttype={validIdHelper(item.type)}
                                ></Tab>
                            ))
                                : ''
                            }
                        </Tabs>
                    </Drawer>
                    <main
                        className={clsx(classes.content, {
                            [classes.contentShift]: drawerOpen,
                        })}
                    >
                        <div className={classes.drawerHeader} />
                        {activeUsecase ?
                            UsecaseContent[activeUsecase].demoComponents.map((item, index) => {
                                const DemoComponent = demoComponentMap[item.type];
                                return (
                                    <TabPanel
                                        key={validIdHelper(`tab-panel-${item.type}-${item.lookerContent[0].id}`)}
                                        value={drawerTabValue}
                                        index={index}
                                        className={classes.relative}
                                    >
                                        {DemoComponent ?
                                            <DemoComponent key={validIdHelper(`list-${item.type}`)}
                                                staticContent={item}
                                                handleDrawerTabChange={handleDrawerTabChange}
                                                activeTabValue={activeTabValue}
                                                handleTabChange={handleTabChange}
                                                lookerUser={lookerUser}
                                                sampleCode={sampleCode}
                                                activeUsecase={activeUsecase}
                                                LookerEmbedSDK={LookerEmbedSDK}
                                            /> :
                                            "Coming Soon"
                                        }
                                    </TabPanel>)
                            }) : ''
                        }
                    </main >
                </ThemeProvider>
            </div >
        )
    }
}
export default withStyles(styles)(Home);