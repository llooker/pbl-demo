import $ from 'jquery';
import _ from 'lodash'
import React, { useState, useEffect } from 'react';
import { AppBar, Tabs, Tab, Typography, Box, Grid, CircularProgress, Card, TextField, Divider } from '@material-ui/core'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import CodeFlyout from '../CodeFlyout';
import useStyles from './styles.js';
import { TabPanel, a11yProps } from './helpers.js';
const { validIdHelper } = require('../../../tools');



export default function SplashPage(props) {

    // console.log('SplashPage')
    // console.log('props', props)

    const classes = useStyles();
    const { staticContent, staticContent: { lookerContent }, staticContent: { type }, activeTabValue, handleTabChange, lookerUser, sampleCode, handleDrawerTabChange } = props;
    const sampleCodeTab = { type: 'sample code', label: 'Code', id: 'sampleCode', lookerUser, sampleCode }
    const tabContent = [...lookerContent, sampleCodeTab];
    const demoComponentType = type || 'sample code';


    const [value, setValue] = useState(0);
    const [iFrameExists, setIFrame] = useState(1);
    const [apiContent, setApiContent] = useState([]);
    const [dashboardObj, setDashboardObj] = useState({});

    const handleChange = (event, newValue) => {
        handleTabChange(0);
        setValue(newValue);
    };


    const performLookerApiCalls = function (lookerContent) {

        // console.log('performLookerApiCalls')
        // console.log('lookerContent', lookerContent)


        let apiContentCopy = [...apiContent];

        lookerContent.map(async lookerContent => {
            if (lookerContent.type === 'query') {
                // console.log('inside iff for query');
            } else if (lookerContent.type === 'look') {
                // console.log('inside else iff for look');
                LookerEmbedSDK.createLookWithId(lookerContent.id)
                    .appendTo(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`))
                    // .withClassName('iframe')
                    .withClassName('look')
                    .withClassName(lookerContent.id)
                    .build()
                    .connect()
                    .catch((error) => {
                        console.error('Connection error', error)
                    })
            } else if (lookerContent.type === 'thumbnail') {
                let lookerResponse = await fetch(`/getthumbnail/${lookerContent.resourceType}/${lookerContent.id}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                })

                let lookerResponseData = await lookerResponse.json();
                $(validIdHelper(`#embedContainer-${demoComponentType}-${lookerContent.id}`)).append(lookerResponseData.svg)
                // setApiContent([...apiContent, lookerResponseData.svg])
            }
        })

    }

    useEffect(() => {
        //change from drill click
        if (activeTabValue > value) {
            setValue(activeTabValue)
        }

        performLookerApiCalls(lookerContent[0])
        // console.log('apiContent.length', apiContent.length)

    }, [lookerContent]);


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
                                        // label="At a glance"
                                        label={item.label ? item.label : 'At a glance'}
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
                                            <React.Fragment
                                                key={`${validIdHelper(demoComponentType + '-outerFragment-' + index)}`}>
                                                <Grid item sm={6}>

                                                    <Typography variant="h5" component="h2" className={classes.gridTitle}>
                                                        Welcome {lookerUser.user_attributes.brand}!<br />
                                                    </Typography>
                                                    <br />
                                                    <Typography variant="h5" component="h5" className={classes.gridTitle}>
                                                        {staticContent.description}<br />
                                                    </Typography>
                                                </Grid>
                                                {tabContentItem.map((lookerContent, innerIndex) => (
                                                    <React.Fragment
                                                        key={`${validIdHelper(demoComponentType + '-innerFragment-' + innerIndex)}`}>
                                                        {innerIndex === 1 ? <Grid item sm={12}><Divider className={`${classes.mt30} ${classes.mb30}`} /></Grid> : ''}
                                                        <Grid
                                                            item
                                                            sm={parseInt(lookerContent.gridWidth)}
                                                            id={validIdHelper(`gridItem-${demoComponentType}-${lookerContent.id}`)}
                                                            key={validIdHelper(`gridItem-${demoComponentType}-${lookerContent.id}`)}
                                                        >
                                                            <div
                                                                className={`embedContainer ${classes.maxHeight200} ${classes.textCenter} ${classes.cursor}`}
                                                                id={validIdHelper(`embedContainer-${demoComponentType}-${lookerContent.id}`)}
                                                                key={validIdHelper(`embedContainer-${demoComponentType}-${lookerContent.id}`)}
                                                                onClick={innerIndex > 0 ? (e) => handleDrawerTabChange(e, innerIndex) : undefined}
                                                            >

                                                                <Typography variant="h5" component="h5" className={classes.gridTitle} align="center">
                                                                    {lookerContent.label}<br />
                                                                </Typography>
                                                                <br />
                                                            </div>
                                                        </Grid>
                                                    </React.Fragment>
                                                )
                                                )}
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