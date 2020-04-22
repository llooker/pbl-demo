import React, { useState, useEffect } from 'react';

//material
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Icon from '@material-ui/core/Icon';
import FilterListIcon from '@material-ui/icons/FilterList';
import LinkIcon from '@material-ui/icons/Link';
import GavelIcon from '@material-ui/icons/Gavel';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import BuildIcon from '@material-ui/icons/Build';

import ComboBox from '../Material/ComboBox'
import Tabs from '../Material/SimpleTabs'

import UsecaseContent from '../../usecaseContent.json'; // still necessary to map over demo components
import '../Home.css'


import $ from 'jquery';

const { validIdHelper } = require('../../tools');

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        // backgroundColor: theme.palette.background.paper,
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
    gridTitle: {
        marginBottom: 12,
    },
    body: {
        marginLeft: 12
    },
    pos: {
        marginBottom: 12,
    },
    divider: {
        marginTop: 24,
        marginBottom: 24
    },
    icon: {
        marginLeft: 12
    },
    hidden: {
        visibility: 'hidden',
        position: 'absolute', //hack for obscuring other elements within Box
        zIndex: -1
    }
}));

export default function CustomFilter(props) {
    // console.log('CustomFilter')
    // console.log('props', props)

    const { staticContent, staticContent: { lookerContent }, staticContent: { type }, apiContent, action, activeTabValue, handleTabChange, lookerUser } = props;
    const classes = useStyles();
    const lookerUserForTab = { type: 'sample code', label: 'Sample Code', id: 'sampleCode', lookerUser }

    // let iFrameExists = $(".embedContainer:visible iframe").length;

    return (
        <div className={classes.root}>

            <Grid container
                spacing={3} >
                <Tabs
                    tabContent={[...lookerContent, lookerUserForTab]}
                    activeTabValue={activeTabValue}
                    handleTabChange={handleTabChange}
                    apiContent={apiContent}
                    action={action} />
            </Grid >

        </div>
    )
}