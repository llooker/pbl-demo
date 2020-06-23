import _ from 'lodash'
import React, { useState, useEffect } from 'react';
import { AppBar, Tabs, Tab, Typography, Box, Grid, CircularProgress, Card, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import CodeFlyout from '../CodeFlyout';
import useStyles from './styles.js';
import { TabPanel, a11yProps } from './helpers.js';
const { validIdHelper } = require('../../../tools');

export default function Dashboard(props) {

    // console.log('Dashboard')
    // console.log('props', props)

    const classes = useStyles();
    const { staticContent: { lookerContent }, staticContent: { type }, activeTabValue, handleTabChange, lookerUser, sampleCode } = props;
    const sampleCodeTab = { type: 'sample code', label: 'Code', id: 'sampleCode', lookerUser, sampleCode }
    const tabContent = [...lookerContent, sampleCodeTab];
    const demoComponentType = type || 'sample code';

    const [value, setValue] = useState(0);
    const [iFrameExists, setIFrame] = useState(0);
    const [apiContent, setApiContent] = useState([]);
    const [dashboardObj, setDashboardObj] = useState({});

    const handleChange = (event, newValue) => {
        handleTabChange(0);
        setValue(newValue);
    };

    useEffect(() => {
        if (activeTabValue > value) {
            setValue(activeTabValue)
        }

        lookerContent.map(async lookerContent => {
            let dashboardId = lookerContent.id;
            LookerEmbedSDK.createDashboardWithId(dashboardId)
                .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${dashboardId}`))
                .withClassName('iframe')
                .withNext()
                // .withNext(lookerContent.isNext || false) //how can I make this dynamic based on prop??
                .withTheme('Embedded')
                .on('drillmenu:click', (event) => typeof this[_.camelCase(demoComponentType) + 'Action'] === 'function' ? this[_.camelCase(demoComponentType) + 'Action'](event) : '')
                .build()
                .connect()
                .then((dashboard) => {
                    setIFrame(1)
                    setDashboardObj(dashboard)
                })
                .catch((error) => {
                    // console.error('Connection error', error)
                })

            if (lookerContent.hasOwnProperty('filter')) {

                //get inline query from usecase file & set user attribute dynamically
                let jsonQuery = lookerContent.inlineQuery;
                jsonQuery.filters = {
                    [lookerContent.desiredFilterName]: lookerUser.user_attributes.brand
                };
                lookerContent.inlineQuery = jsonQuery;

                let stringifiedQuery = encodeURIComponent(JSON.stringify(lookerContent.inlineQuery))
                let lookerResponse = await fetch('/runinlinequery/' + stringifiedQuery + '/json', {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                let lookerResponseData = await lookerResponse.json();
                let queryResultsForDropdown = [];
                let desiredProperty = Object.keys(lookerResponseData.queryResults[0])[0];
                for (let i = 0; i < lookerResponseData.queryResults.length; i++) {
                    queryResultsForDropdown.push({ 'label': lookerResponseData.queryResults[i][desiredProperty] })
                }
                setApiContent(queryResultsForDropdown);
            }
        })
    }, [lookerContent]);

    const customFilterAction = (dashboardId, filterName, newFilterValue) => {
        if (Object.keys(dashboardObj).length) {
            dashboardObj.updateFilters({ [filterName]: newFilterValue })
            dashboardObj.run()
        }
    }

    return (
        <div className={`${classes.root} demoComponent`}>
            <Grid container
                spacing={3}
                key={validIdHelper(type)} >
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
                                        key={`${validIdHelper(demoComponentType + '-tab-' + index)}`}
                                        label={item.label}
                                        className={item.type === 'sample code' ? `${classes.mlAuto}` : ``}
                                        {...a11yProps(index)} />
                                ))}
                            </Tabs>
                        </AppBar>
                        <Box className="tabPanelContainer">
                            {tabContent.map((tabContentItem, index) => (
                                <TabPanel
                                    key={`${validIdHelper(demoComponentType + '-tabPanel-' + index)}`}
                                    value={value}
                                    index={index}>
                                    <Grid container>
                                        {tabContentItem.type === 'sample code' ?
                                            <Grid item sm={12} >
                                                {/* <Typography variant="h5" component="h2" className={classes.gridTitle}>
                                                    Sample Code<br />
                                                </Typography>
                                                <CodeFlyout code={tabContentItem.sampleCode} /> */}
                                                <Typography variant="h5" component="h2" className={classes.gridTitle}>
                                                    Looker User<br />
                                                </Typography>
                                                <CodeFlyout code={tabContentItem.lookerUser} />
                                            </Grid>
                                            :
                                            <React.Fragment
                                                key={`${validIdHelper(demoComponentType + '-innerFragment-' + index)}`}>
                                                {tabContentItem.filter ?
                                                    <Grid item sm={12}>
                                                        <Autocomplete
                                                            id={`combo-box-dashboard-${lookerContent.id}`}
                                                            options={Array.isArray(apiContent) ?
                                                                apiContent :
                                                                []}
                                                            getOptionLabel={(option) => option.label}
                                                            style={{ width: 300 }}
                                                            onChange={(event) => customFilterAction(tabContentItem.id, tabContentItem.filter.filterName, event.target.innerText || '')}
                                                            renderInput={(params) => <TextField {...params} label={tabContentItem.filter.filterName} variant="outlined" />}
                                                            loadingText="Loading..."
                                                        />
                                                    </Grid> : ''
                                                }
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