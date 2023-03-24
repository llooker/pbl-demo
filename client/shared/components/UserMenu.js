import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, } from "react-router-dom";
import { IconButton, Menu, MenuItem, Typography, Divider, TextField, Avatar, Link } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { appContextMap, validIdHelper, endSession } from '../utils'
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

export const UserMenu = ({ classes, content }) => {

  let history = useHistory();
  let { setPaywallModal, clientSession, setClientSession, handleSwitchLookerUser, setIsReady, setSdk } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME])
  const {lookerUser} = clientSession;
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(lookerUser.user_attributes.brand || '');
  const { permissionLevels, rowLevelAttribute, src, imageStyle } = content
  const isGoogleEmployee = lookerUser.external_user_id.match(/^[A-Za-z0-9._%+-]+@google.com$/)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (newValue, property) => {
    setAnchorEl(null);
    if (newValue == null) {
      setIsReady(false);
      endSession();
      setClientSession({})
      setSdk()
      history.push("/");
    } else if (newValue === 'paywallModal') {
      setPaywallModal({
        'show': true,
        'permissionNeeded': 'explore'
      })
    } else if (newValue === 'architectureModal') {
      // console.log("test test test")
      setPaywallModal({
        'show': true,
        'permissionNeeded': null,
        "src": src,
        "imageStyle": imageStyle
      })
    } else if (typeof newValue === 'string') {
      handleSwitchLookerUser(newValue, property)
    }
  };
  useEffect(() => {
    setSelectedBrand(clientSession.lookerUser.user_attributes.brand || '')
  }, [clientSession.lookerUser]);

  const level = typeof clientSession.lookerUser.user_attributes.permission_level === 'string' ?
  `${_.capitalize(clientSession.lookerUser.user_attributes.permission_level)} Account` : '';
  
  return (
    <div className={`${classes.zIndex1500}`}>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
        <div style={{textAlign: "right", marginLeft: "1rem"}}>
          <Typography style={{color:"#9BA3B2"}}>{clientSession.userProfile.name}</Typography>
          <Typography>{level}</Typography>
        </div>
        <ChevronRightIcon style={{alignSelf: "flex-end", transform: "rotate(90deg)"}}/>
        <Avatar alt={clientSession.userProfile.name} src={clientSession.userProfile.picture} className={`${classes.mr12} ${classes.ml12}`} />
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
        {content.allowModal ?
          <div>
            <MenuItem onClick={() => handleClose('paywallModal')}>Show Monetization Modal</MenuItem> 
            <MenuItem onClick={() => handleClose('architectureModal')}>Show Architecture Diagram</MenuItem>
          </div>
          : ""}
        {isGoogleEmployee ?
        <MenuItem >

          <Link href={clientSession.lookerInstance} target="_blank">Access Looker Instance 
          <OpenInNewIcon className={`${classes.ml12} ${classes.verticalAlignMiddle}`}/>
          </Link>
        </MenuItem>
        : ""}
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
