import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppContext from '../../AppContext';
import { Modal, Fade, Grid, Paper, Card, CardContent, CardActions, Button, Typography, Chip } from '@material-ui/core';
import LookerUserPermissions from '../../lookerUserPermissions.json';
const { validIdHelper } = require('../../tools');

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 1000,
    maxHeight: 450,
    overflow: 'scroll',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    maxHeight: 300,
    minHeight: 300,
    overflow: 'scroll',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.05)',
      transition: 'transform .2s'
    }
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

function getModalStyle() {
  const top = 10 //+ rand();
  const left = 50 //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${left}%, -${top}%)`,
  };
}


export function MonetizationModal({ props, switchLookerUser }) {
  // console.log('MonetizationModal')
  const { payWallModal, togglePayWallModal, lookerUser } = useContext(AppContext);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();


  return (
    < Modal
      className={`${classes.modal} ${classes.padding15}`}
      open={payWallModal.show || false}
      onClose={togglePayWallModal}
    >
      <Fade in={payWallModal.show || false}>
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">Upgrade user account to {payWallModal.permissionNeeded}</h2>

          <Grid container
            spacing={3}>
            {Object.keys(LookerUserPermissions).map(key => {
              return (
                <Grid item sm={4}
                  key={validIdHelper(`monetizationModal-gridItem-${key}`)}
                >

                  <Card className={`${classes.card} `} elevation={1}
                    style={key === lookerUser.permission_level ? {
                      transform: 'scale(1.05)',
                      transition: 'transform .2s'
                    } : {}}>
                    <CardContent>

                      <Typography variant="h6">
                        {_.capitalize(key)} user permissions
                      {key === lookerUser.permission_level ? <Chip
                          label="Active" /> : ''}
                      </Typography>


                      {key === 'advanced' ?
                        <Typography variant="subtitle2" gutterBottom>...Basic user permissions plus</Typography> :
                        key === 'premium' ?
                          <Typography variant="subtitle2" gutterBottom>...Advanced user permissions plus</Typography> :
                          ''}

                      {LookerUserPermissions[key] ? LookerUserPermissions[key].map(permission => (
                        <Typography variant="subtitle2"
                          gutterBottom
                          color="secondary"
                          key={validIdHelper(`monetizationModal-${key}-permissionItem-${permission}`)}
                          style={permission === payWallModal.permissionNeeded ? { backgroundColor: 'yellow' } : {}}>
                          {key === 'basic' ?
                            permission :
                            key === 'advanced' && LookerUserPermissions['basic'].indexOf(permission) == -1 ?
                              permission :
                              key === 'premium' && LookerUserPermissions['advanced'].indexOf(permission) == -1 ? permission : ''}
                        </Typography>
                      )) : ''}

                    </CardContent>

                    <CardActions disableSpacing={false}>
                      {key === lookerUser.permission_level ? '' :
                        <Button color="primary"
                          onClick={() => {
                            switchLookerUser(key)
                            togglePayWallModal()
                          }}>{'Upgrade'}</Button>
                      }
                    </CardActions>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </div>
      </Fade >
    </Modal >
  );
}
