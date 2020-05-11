import React, { useState, useEffect } from 'react';

//material
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
// import Modal from '@material-ui/core/Modal';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
import ModalTable from '../Material/ModalTable';
import Icon from '@material-ui/core/Icon';
import UsecaseContent from '../../usecaseContent.json'; // still necessary to map over demo components
import '../Home.css'

const { validIdHelper, prettifyString } = require('../../tools');

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
    },
    paper: {
        position: 'absolute',
        width: 800,
        maxHeight: 400,
        overflow: 'scroll',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    }
}));

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 64; //+ rand();
    const left = 50; // + rand();

    return {
        top: top,
        left: `${left}%`,
        transform: `translateX(-${left}%)`,
    };
}

//https://demo.looker.com/explore/thelook_adwords/sessions?qid=GsGOKU9FHlQ3cHoqaw57l5
//option 1 create iframe using url from links response in api call
//option 2 taking fields from URL

export default function SplashPage(props) {
    // console.log('SplashPage')
    // console.log('props', props)

    const classes = useStyles();
    const { staticContent, staticContent: { lookerContent }, apiContent, handleDrawerTabChange, activeUsecase, action } = props;
    const [open, setOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});

    // console.log('apiContent', apiContent)

    const handleModalOpen = (title, data) => {
        let updatedModalContent = { ...modalContent }
        updatedModalContent.title = title;
        updatedModalContent.body = data;
        setOpen(true);
        setModalContent(updatedModalContent)
    };

    const handleModalClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        // console.log('useEffect')
    }, [modalContent, apiContent]);



    return (
        <div className={`${classes.root} demoComponent`}>

            <Typography variant="h5" component="h2" className={classes.gridTitle}>
                {staticContent.title}
                <br />
            </Typography>
            <Grid container
                spacing={3} >
                {lookerContent.map((item, index) => (
                    <Grid item xs={12} sm={4} key={`atAGlance${index}`}>
                        {apiContent[index] && apiContent[index].detail ?
                            <Card className={`${classes.card} text-center`}
                                onClick={() => {
                                    setOpen(true);
                                    handleModalOpen(lookerContent[index].modalLabel,
                                        apiContent[index].detail.length ? apiContent[index].detail : apiContent[index].glance.queryResults.data
                                    )
                                }
                                }
                            >
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {lookerContent[index].cardLabel}
                                    </Typography>
                                    <br />
                                    <Typography variant="h6" component="h6">
                                        {
                                            lookerContent[index].desiredMethod
                                                ?
                                                (apiContent[index].glance.queryResults.data[lookerContent[index].desiredMethod]).toLocaleString() //value
                                                : (apiContent[index].glance.queryResults.data[0][lookerContent[index].desiredProperty].rendered).toLocaleString()
                                        }
                                    </Typography>
                                </CardContent>
                            </Card>
                            : apiContent[index] && apiContent[index].glance.queryResults.errors ?

                                <Card className={`${classes.card} text-center`}
                                >
                                    <CardContent>
                                        <Typography variant="h5" component="h2" color="error">
                                            Error
                                        </Typography>
                                        <br />
                                        <Typography variant="h6" component="h6" color="error">
                                            {JSON.stringify(apiContent[index].glance.queryResults.errors[0].message.substring(0, 50))}...
                                        </Typography>
                                    </CardContent>
                                </Card>
                                :
                                <Card className={`${classes.card} ${classes.flexCentered}`}>
                                    <CircularProgress className={classes.circularProgress} />
                                </Card>}
                    </Grid>
                ))}

                {open ? <ModalTable
                    {...props}
                    open={open}
                    onClose={handleModalClose}
                    classes={classes}
                    modalContent={modalContent}
                /> : ''}

            </Grid >

            <Divider className={classes.divider} />

            <Typography variant="h5" component="h2" className={classes.gridTitle}>
                Take actions on your data:
            <br />
            </Typography>
            <Grid container
                spacing={3} >
                {UsecaseContent[activeUsecase].demoComponents.map((item, index) => (
                    index > 0 ?
                        <Grid item xs={12} sm={4} className="pointer" key={`demoComponentLink${index}`} onClick={(e) => handleDrawerTabChange(e, index)}>
                            <Card className={`${classes.card} text-center`}>
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {item.label}
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