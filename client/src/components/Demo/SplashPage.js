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

import UsecaseContent from '../../usecaseContent.json'; // still necessary to map over demo components
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
    },
    icon: {
        marginLeft: 12
    }
}));

export default function SplashPage(props) {
    // console.log('SplashPage')
    // console.log('props', props)

    const { staticContent, apiContent, handleDrawerTabChange } = props;
    const { lookerContent } = staticContent
    const classes = useStyles();

    return (
        <div className={classes.root}>

            <Typography variant="h5" component="h2" className={classes.gridTitle}>
                {staticContent.title}
                <br />
            </Typography>
            <Grid container
                spacing={3} >
                {lookerContent.map((item, index) => (
                    <Grid item xs={12} sm={4} key={`atAGlance${index}`}>
                        {apiContent[index] ?
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
                                                (apiContent[index].queryResults[0][lookerContent[index].desiredProperty]).toLocaleString()
                                                : (apiContent[index].queryResults[lookerContent[index].desiredMethod]).toLocaleString()
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
                        <Grid item xs={12} sm={4} className="pointer" key={`demoComponentLink${index}`} onClick={(e) => handleDrawerTabChange(e, index)}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {item.label}
                                        {/* {React.createElement(iconMap[item.type])} */}
                                        <Icon className={`fa ${item.icon} ${classes.icon}`} />
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