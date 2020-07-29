import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppContext from '../../AppContext';
import { Modal, Fade, Grid, Paper, Card } from '@material-ui/core';
import LookerUserPermissions from '../../lookerUserPermissions.json';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 800,
    maxHeight: 450,
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
    // minWidth: 275,
    minHeight: '10rem',
    // boxShadow: 'none'
  },
  flexCentered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  padding15: {
    padding: 15
  }
}));

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 //+ rand();
  const left = 50 //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


export function MonetizationModal() {
  // { classes }
  const { showPayWallModal, toggleShowPayWallModal, lookerUser } = useContext(AppContext);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();

  return (
    <Modal
      className={classes.modal}
      open={showPayWallModal}
      onClose={toggleShowPayWallModal}
    >
      <div style={modalStyle} className={classes.paper}>
        {/* <Fade in={showPayWallModal}> */}
        {/* <div className={classes.paper}>
          <h3>Tier Type: {lookerUser.permission_level}</h3>
        </div> */}
        {/* <Paper> */}
        <Grid container
          spacing={3}>
          {Object.keys(LookerUserPermissions).map(key => {
            return (
              <Grid item sm={4}>
                <Card className={`${classes.card} ${classes.padding15}`} elevation={1}>
                  {key}
                </Card>
              </Grid>
            )
          })}
        </Grid>
        {/* </Paper> */}
        {/* </Fade> */}
      </div>
    </Modal>
  );
}
