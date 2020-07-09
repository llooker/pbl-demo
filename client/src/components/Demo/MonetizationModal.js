import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../AppContext';
import { Modal, Fade } from '@material-ui/core';



export function MonetizationModal({ classes }) {
  const { showPayWallModal, toggleShowPayWallModal, lookerUser } = useContext(AppContext)
  return (
    <Modal
      className={classes.modal}
      open={showPayWallModal}
      onClose={toggleShowPayWallModal}
    >
      <Fade in={showPayWallModal}>
        <div className={classes.paper}>
          <h3>Tier Type: {lookerUser.permission_level}</h3>
        </div>
      </Fade>
    </Modal>
  );
}
