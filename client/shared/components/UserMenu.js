import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, } from "react-router-dom";
import { IconButton, Menu, MenuItem, Typography, Divider, TextField, Avatar } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { lookerUserAttributeBrandOptions, lookerUserPermissions } from '../LookerHelpers/defaults';
import { endSession } from '../utils/auth';
import { appContextMap, validIdHelper } from '../utils/tools';

export const UserMenu = ({ classes }) => {
  let history = useHistory();
  let { setPaywallModal, clientSession, setClientSession, handleSwitchLookerUser } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME])
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(clientSession.lookerUser.user_attributes.brand || '');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (newValue, property) => {
    setAnchorEl(null);
    if (newValue == null) {
      setClientSession({})
      history.push("/")
      endSession();
    } else if (newValue === 'modal') {
      setPaywallModal({
        'show': true,
        'permissionNeeded': 'explore'
      })
    } else if (typeof newValue === 'string') {
      handleSwitchLookerUser(newValue, property)
    }
  };
  useEffect(() => {
    // console.log('useEffect')
    setSelectedBrand(clientSession.lookerUser.user_attributes.brand || '')
  }, [clientSession.lookerUser]);

  return (
    <div className={`${classes.zIndex1500}`}>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
        <Avatar alt={clientSession.userProfile.name} src={clientSession.userProfile.imageUrl} className={classes.mr12} />

        <Typography>
          {typeof clientSession.lookerUser.user_attributes.permission_level === 'string' ?
            clientSession.lookerUser.user_attributes.permission_level.charAt(0).toUpperCase() + clientSession.lookerUser.user_attributes.permission_level.substring(1) : ''}
        </Typography>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem autoFocus={false}>Select User Level</MenuItem>

        {Object.keys(lookerUserPermissions).map(key => {
          return (<MenuItem
            key={validIdHelper(`$lookerUserPermission-MenuItem-${key}`)}
            autoFocus={false}
            onClick={() => handleClose(key, 'permission')}>{_.capitalize(key)}</MenuItem>)
        })}

        <Divider className={classes.divider} />
        <MenuItem onClick={() => handleClose(null)}>Sign Out</MenuItem>
        <Divider className={classes.divider} />
        <MenuItem onClick={() => handleClose('modal')}>Show Monetization Modal</MenuItem>
        <Divider className={classes.divider} />
        <MenuItem>Current brand: {selectedBrand}</MenuItem>
        <MenuItem>
          <Autocomplete
            id="combo-box-usermenu"
            options={lookerUserAttributeBrandOptions || []}
            getOptionLabel={(option) => option.label}
            style={{ width: 300 }}
            onChange={(event) => handleClose((event.target.innerText || ''), 'brand')}
            renderInput={(params) => <TextField {...params}
              label="Change merchant brand"
              variant="outlined"
            />}
            loadingText="Loading..."
            disableautofocus="true"
            onKeyDown={(event) => event.stopPropagation()}
          />
        </MenuItem>
      </Menu>
    </div>
  );
}
