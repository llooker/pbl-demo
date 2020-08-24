import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppContext from '../../AppContext';
import { Modal, Fade, Grid, Paper, Card, CardContent, CardActions, Button, Typography, Chip, Divider, List, ListItem, ListItemAvatar, Avatar, ImageIcon, ListItemText } from '@material-ui/core';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckIcon from '@material-ui/icons/Check';
import LookerUserPermissions from '../../lookerUserPermissions.json';
const { validIdHelper } = require('../../tools');

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 1000,
    height: 580,
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
    // height: 520,
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
  },
  divider: {
    marginTop: 15,
    marginBottom: 15,
    color: '#fff'
  },
  basic: {

  },
  advanced: {

  },
  premium: {
    backgroundColor: '#5F6BD8',
    color: '#ffffff'
  },
  font75: {
    fontSize: '.75em'
  },
  font875: {
    // fontSize: '.875em'
  },
  padding30: {
    padding: 30
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
  const { payWallModal, togglePayWallModal, lookerUser } = useContext(AppContext);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();

  const modalListMap = {
    'basic': [
      '6 months of order data history',
      'Atom Merchant Dashboards',
      'Download PDFs, CSVs'
    ],
    'advanced': [
      'Full year of order data history',
      'Drill to row level information',
      'Download row level information',
      'Schedule dashboards for delivery (to you or others)',
      'Set alerts and key threshold notifications'],
    'premium': [
      '2 Full years of order data history',
      'Analyze your own data and save custom reports',
      'View premium level, productivity enhancing reports',
      'Share your reports with colleagues in Atom',
      'Text message alerts',
      // 'Notify active shoppers on Atom',
      // 'Apply Atom’s advanced AI insights to stay ahead of trends'
    ]
  }


  return (
    < Modal
      className={`${classes.modal} `}
      open={payWallModal.show || false}
      onClose={togglePayWallModal}
    >
      <Fade in={payWallModal.show || false}>
        <div
          style={modalStyle}
          className={`${classes.paper} ${classes.padding30}`}>
          <Grid container
            spacing={3}>
            {Object.keys(LookerUserPermissions).map(key => {
              return (
                <Grid item sm={4}
                  key={validIdHelper(`monetizationModal-gridItem-${key}`)}
                >
                  <Card className={`${classes.card} ${classes[key]}`}
                    elevation={1}
                    style={key === lookerUser.user_attributes.permission_level ? {
                      transform: 'scale(1.05)',
                      transition: 'transform .2s',
                      height: 495
                    } : {
                        height: 495
                      }}
                    onClick={() => {
                      switchLookerUser(key, 'permission')
                      togglePayWallModal()
                    }}>
                    <CardContent>
                      <Typography variant="h6">
                        {_.capitalize(key)}
                      </Typography>
                      <Typography variant="subtitle1" style={{ fontStyle: 'italic' }}>
                        {key === 'basic' ?
                          'Drive your business with clear KPIs' :
                          key === 'advanced' ?
                            'Deeper insights, operations' :
                            'Drive your business with Atom'
                        }
                      </Typography>

                      <Divider className={`${classes.divider} `} />

                      <List className={classes.root}>
                        {
                          modalListMap[key].map((item, index) => (
                            <ListItem dense={true}
                              className={classes.font875}
                              key={`monetizationModal-ListItem-${key}-${index}`}
                            >
                              <ListItemIcon
                              >
                                <CheckIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={item} />
                            </ListItem>
                          ))
                        }
                      </List>
                    </CardContent>
                    <CardActions disableSpacing={false}>
                      <Button
                        color="primary"
                        variant="outlined"
                        disabled={key === lookerUser.user_attributes.permission_level ? true : false}
                        fullWidth
                        onClick={() => {
                          switchLookerUser(key, 'permission')
                          togglePayWallModal()
                        }}>
                        {Object.keys(modalListMap).indexOf(lookerUser.user_attributes.permission_level) < Object.keys(modalListMap).indexOf(key) ? 'Upgrade' : 'Switch'}
                        {/* {'Upgrade'} */}
                      </Button>
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
