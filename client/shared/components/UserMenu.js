import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, } from "react-router-dom";
import { IconButton, Menu, MenuItem, Typography, Divider, TextField, Avatar } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { appContextMap, validIdHelper, endSession } from '../utils'


export const UserMenu = ({ classes, content }) => {
  // console.log("UserMenu");
  // console.log({ content })

  let history = useHistory();
  let { setPaywallModal, clientSession, setClientSession, handleSwitchLookerUser, setIsReady } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME])
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(clientSession.lookerUser.user_attributes.brand || '');
  const { permissionLevels, rowLevelAttribute } = content



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (newValue, property) => {
    setAnchorEl(null);
    if (newValue == null) {
      setIsReady(false);
      endSession();
      setClientSession({})
      history.push("/");
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

        {Object.keys(permissionLevels).map(key => {
          return (<MenuItem
            key={validIdHelper(`$lookerUserPermission-MenuItem-${key}`)}
            autoFocus={false}
            onClick={() => handleClose(key, 'permission')}>{_.capitalize(key)}</MenuItem>)
        })}

        <Divider className={classes.divider} />
        <MenuItem onClick={() => handleClose(null)}>Sign Out</MenuItem>
        <Divider className={classes.divider} />
        <MenuItem onClick={() => handleClose('modal')}>Show Monetization Modal</MenuItem>
        {Object.keys(rowLevelAttribute).length ? <div>
          <Divider className={classes.divider} />
          <MenuItem>{rowLevelAttribute.menuItemLabel}: {selectedBrand}</MenuItem>
          <MenuItem>
            <Autocomplete
              id="combo-box-usermenu"
              options={rowLevelAttribute.options || []}
              getOptionLabel={(option) => option.label}
              style={{ width: 300 }}
              onChange={(event) => handleClose((event.target.innerText || ''), 'brand')}
              renderInput={(params) => <TextField {...params}
                label={rowLevelAttribute.autoCompleteLabel}
                variant="outlined"
              />}
              loadingText="Loading..."
              disableautofocus="true"
              onKeyDown={(event) => event.stopPropagation()}
            />
          </MenuItem></div> : ""}
      </Menu>
    </div>
  );
}
