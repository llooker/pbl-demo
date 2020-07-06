import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../AppContext';
import { Modal, Fade } from '@material-ui/core';

const ALL_ITEMS = [{
  label: "Tait",
  tier: 0,
},{
  label: "and",
  tier: 0,
},{
  label: "his",
  tier: 0,
},{
  label: "little",
  tier: 0,
},{
  label: "boy",
  tier: 0,
},{
  label: "toys",
  tier: 1,
},{
  label: "don't",
  tier: 1,
},{
  label: "have",
  tier: 1,
},{
  label: "any",
  tier: 2,
},{
  label: "fun",
  tier: 2,
}]

export function MonetizationModal({classes}) {
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
