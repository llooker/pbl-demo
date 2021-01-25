import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../contexts/AppContext';
import {
  Modal, Fade, Grid, Card, CardContent, CardActions, Button, Typography, Divider, List, ListItem, ListItemText
} from '@material-ui/core';
import { Rating } from '@material-ui/lab'
import { ListItemIcon } from '@material-ui/core'; //already declared
import { Check } from '@material-ui/icons';
import useStyles from './styles.js';
import { lookerUserPermissions } from '@pbl-demo/components/LookerHelpers/defaults';
const { validIdHelper } = require('../../../tools');

function getModalStyle() {
  const top = 10 //+ rand();
  const left = 50 //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${left}%, -${top}%)`,
  };
}

export default function MonetizationModal(props) {
  // console.log('MonetizationModal')
  let { clientSession, payWallModal, setPaywallModal, handleSwitchLookerUser } = useContext(AppContext)


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
      onClose={() => setPaywallModal({})}
    >
      <Fade in={payWallModal.show || false}>
        <div
          style={modalStyle}
          className={`${classes.paper} ${classes.padding30}`}>
          <Grid container
            spacing={3}>
            {Object.keys(lookerUserPermissions).map(key => {
              return (
                <Grid item sm={4}
                  key={validIdHelper(`monetizationModal-gridItem-${key}`)}
                >
                  <Card className={`${classes.card} ${classes[key]}`}
                    elevation={1}
                    style={key === clientSession.lookerUser.user_attributes.permission_level ? {
                      // transform: 'scale(1.05)',
                      // transition: 'transform .2s',
                      backgroundColor: '#5F6BD8',
                      color: '#ffffff',
                      height: 519
                    } : {
                        height: 519
                      }}
                    onClick={() => {
                      handleSwitchLookerUser(key, 'permission')
                      setPaywallModal({})
                    }}>
                    <CardContent>
                      <Typography variant="h6"
                      // display="justify"
                      >
                        {_.capitalize(key)}
                      </Typography>
                      <Typography
                      // display="justify"
                      >
                        <Rating
                          name="read-only"
                          value={key === 'basic' ? 3 : key === "advanced" ? 4 : 5}
                          readOnly /></Typography>
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
                                <Check fontSize="small" />
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
                        // disabled={key === lookerUser.user_attributes.permission_level ? true : false}
                        fullWidth
                        onClick={() => {
                          handleSwitchLookerUser(key, 'permission')
                          setPaywallModal({})
                        }}
                        style={key === clientSession.lookerUser.user_attributes.permission_level ? { color: '#ffffff', borderColor: "#ffffff" } : {}}>
                        {key === clientSession.lookerUser.user_attributes.permission_level ? "Active" :
                          Object.keys(modalListMap).indexOf(clientSession.lookerUser.user_attributes.permission_level) < Object.keys(modalListMap).indexOf(key) ?
                            'Upgrade' :
                            'Switch'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </div >
      </Fade >
    </Modal >
  );
}
