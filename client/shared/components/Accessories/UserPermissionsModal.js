import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { Modal, Fade, Grid, Card, CardContent, CardActions, Button, Typography, Divider, List, ListItem, ListItemText } from '@material-ui/core';
import { Rating } from '@material-ui/lab'
import { ListItemIcon } from '@material-ui/core'; //already declared
import { Check } from '@material-ui/icons';
import { appContextMap, validIdHelper } from '../../utils/tools';

function getModalStyle() {
  const top = 10 //+ rand();
  const left = 50 //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${left}%, -${top}%)`,
  };
}

export const UserPermissionsModal = ({ content, classes }) => {
  // console.log('MonetizationModal');
  // console.log({ content })
  const { clientSession, payWallModal, setPaywallModal, handleSwitchLookerUser } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const [modalStyle] = React.useState(getModalStyle);
  const { permissionLevels, modalPermissionsMap } = content;

  return (
    < Modal
      className={`${classes.modal} `}
      open={payWallModal.show || false}
      onClose={() => setPaywallModal({})}
    >
      <Fade in={payWallModal.show || false}>
        <div
          style={modalStyle}
          className={`${classes.modalPopover} ${classes.padding30}`}
        >
          <Grid container
            spacing={3}>
            {Object.keys(permissionLevels).map((key, index) => {
              return (
                <Grid item sm={12 / Object.keys(permissionLevels).length}
                  key={validIdHelper(`monetizationModal-gridItem-${key}`)}
                >
                  <Card className={`${classes.modalCard} ${classes[key]}`}
                    elevation={1}
                    style={key === clientSession.lookerUser.user_attributes.permission_level ? {
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
                      <Typography variant="h6">
                        {_.capitalize(key)}
                      </Typography>
                      <Typography>
                        <Rating
                          name="read-only"
                          value={5 - Object.keys(permissionLevels).length + index + 1}
                          readOnly /></Typography>
                      <Typography variant="subtitle1" style={{ fontStyle: 'italic' }}>
                        {modalPermissionsMap[key].title}
                      </Typography>

                      <Divider className={`${classes.divider} `} />

                      <List>
                        {
                          modalPermissionsMap[key].list.map((item, index) => (
                            <ListItem dense={true}
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
                        fullWidth
                        onClick={() => {
                          handleSwitchLookerUser(key, 'permission')
                          setPaywallModal({})
                        }}
                        style={key === clientSession.lookerUser.user_attributes.permission_level ? { color: '#ffffff', borderColor: "#ffffff" } : {}}>
                        {key === clientSession.lookerUser.user_attributes.permission_level ? "Active" :
                          Object.keys(modalPermissionsMap).indexOf(clientSession.lookerUser.user_attributes.permission_level) < Object.keys(modalPermissionsMap).indexOf(key) ?
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
