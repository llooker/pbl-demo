import React, { useState, useEffect } from 'react';

//material
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


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

export default function ComingSoon(props) {
    // console.log('ComingSoon')
    // console.log('props', props)

    const classes = useStyles();
    const { label } = props.staticContent

    return (
        <div className={classes.root}>

            <Grid container
                spacing={3}>
                <Box>
                    <Typography variant="h5" component="h2" className={classes.gridTitle}>
                        {label} Component Coming soon!
                    <br />
                    </Typography>
                </Box>
            </Grid >

        </div>
    )
}