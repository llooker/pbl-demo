import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
const { validIdHelper, prettifyString } = require('../../tools');

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 800,
        maxHeight: 400,
        overflow: 'scroll',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    table: {
        maxHeight: 310
    },
    card: {
        minWidth: 275,
        minHeight: '10rem',
        boxShadow: 'none'
    },
    flexCentered: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
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

export default function ModalTable(props) {
    // console.log('ModalTable')
    // console.log('props', props)

    const classes = useStyles();
    const { open, onClose, modalContent } = props;
    const [modalStyle] = React.useState(getModalStyle);


    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >

            <div style={modalStyle} className={classes.paper}>
                <h2 id="simple-modal-title">{modalContent.title}</h2>
                {modalContent.body ?
                    <TableContainer component={Paper} className={classes.table}>
                        <Table stickyHeader className={classes.table} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    {Object.keys(modalContent.body[0]).map((key, index) => (
                                        <TableCell align="right"
                                            key={validIdHelper(key + '-TableHead-TableCell-' + index)}
                                            id={validIdHelper(key + '-TableHead-TableCell-' + index)}>
                                            {prettifyString(key.substring(key.lastIndexOf('.') + 1, key.length))}</TableCell>

                                        //<TableCell>{key}</TableCell>
                                        // console.log('key', key)

                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {modalContent.body.map((item, index) => (

                                    <TableRow
                                        key={validIdHelper('TableRow-' + index)}
                                        id={validIdHelper('TableRow-' + index)} >
                                        {
                                            Object.keys(item).map(key => (
                                                <TableCell align="right"
                                                    key={validIdHelper(key + '-TableBody-TableCell-' + index)}
                                                    id={validIdHelper(key + '-TableBody-TableCell-' + index)}>
                                                    {
                                                        modalContent.body[index][key] ?
                                                            modalContent.body[index][key].rendered ?
                                                                modalContent.body[index][key].rendered :
                                                                modalContent.body[index][key].value ?
                                                                    modalContent.body[index][key].value :
                                                                    typeof modalContent.body[index][key] === 'number' ?
                                                                        (Math.round(modalContent.body[index][key] * 100) / 100).toLocaleString() :
                                                                        modalContent.body[index][key].toLocaleString() :
                                                            ''
                                                    }
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer >
                    :

                    <Card className={`${classes.card} ${classes.flexCentered}`}>
                        <CircularProgress className={classes.circularProgress} />
                    </Card>}

            </div >
        </Modal >
    )
}