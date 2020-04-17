import React, { useState, useEffect } from 'react';

//material

// import Grid from '@material-ui/core/Grid';
// import SimpleCard from '../Material/SimpleCard'
// import Grid from '../Material/Grid'

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


import $ from 'jquery';
import UsecaseContent from '../../usecaseContent.json'
import '../Home.css'

const { validIdHelper } = require('../../tools');

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    card: {
        minWidth: 275,
        minHeight: '10rem',
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
    }
}));

export default function SplashPage(props) {
    // console.log('SplashPage')
    // console.log('props', props)

    const dynamicLookerContent = props.dynamicLookerContentForSplashPage;
    const { lookerContent, handleChange } = props;
    const classes = useStyles();

    //old from report builder, leave for now
    /*const [activeFolder, setActiveFolder] = useState("all")
    const handleChange = (event) => {
        // console.log('handleChange');
        // console.log('event.target', event.target);
        setActiveFolder(event.target.name)
    }*/

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // console.log('useEffect')
    });

    return (
        <div className={classes.root}>

            <Typography variant="h5" component="h2" className={classes.gridTitle}>
                {UsecaseContent.marketing.demoComponents[0].title}
                <br />
            </Typography>
            <Grid container
                spacing={3} >
                {lookerContent.map((item, index) => (
                    <Grid item xs={12} sm={4} key={`atAGlance${index}`}>
                        {dynamicLookerContent[index] ?
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {lookerContent[index].label}
                                    </Typography>
                                    <br />
                                    <Typography className={classes.body} variant="body2" component="p">
                                        {
                                            lookerContent[index].desiredProperty
                                                ?
                                                (dynamicLookerContent[index].queryResults[0][lookerContent[index].desiredProperty]).toLocaleString()
                                                : (dynamicLookerContent[index].queryResults[lookerContent[index].desiredMethod]).toLocaleString()
                                        }
                                    </Typography>
                                </CardContent>
                            </Card>
                            :
                            <Card className={`${classes.card} ${classes.flexCentered}`}>
                                <CircularProgress className={classes.circularProgress} />
                            </Card>}
                    </Grid>
                ))}
            </Grid >


            <Divider className={classes.divider} />

            <Typography variant="h5" component="h2" className={classes.gridTitle}>
                Take actions on your data:
            <br />
            </Typography>
            <Grid container
                spacing={3} >
                {UsecaseContent.marketing.demoComponents.map((item, index) => (
                    index > 0 ?
                        <Grid item xs={12} sm={4} className="pointer" key={`demoComponentLink${index}`} onClick={(e) => handleChange(e, index)}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {item.label}
                                    </Typography>
                                    <br />
                                    <Typography className={classes.body} variant="body2" component="p">
                                        {item.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        : ''
                ))}
            </Grid >

        </div >
    )
}