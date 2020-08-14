import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Menu, MenuItem, Typography, Divider, TextField, Avatar } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import AppContext from '../../AppContext';

const { validIdHelper } = require('../../tools');

const useStyles = makeStyles((theme) => ({
  zIndex1500: {
    zIndex: 1500
  },
  mr12: {
    marginRight: 12
  }
}))

export default function UserMenu(props) {
  // console.log('UserMenu')
  // console.log('props', props)

  const { lookerUser, switchLookerUser, onLogoutSuccess, lookerUserAttributeBrandOptions, switchUserAttributeBrand } = props
  const classes = useStyles();
  const { toggleShow } = useContext(AppContext)
  const { userProfile } = useContext(AppContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedBrand, setSelectedBrand] = React.useState(lookerUser.user_attributes.brand || '');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (newValue) => {


    setAnchorEl(null);
    if (newValue == null) {
      onLogoutSuccess({})
    } else if (newValue === 'basic' || newValue === 'advanced' || newValue === 'premium') {
      switchLookerUser(newValue)
    } else if (typeof newValue === 'string') {
      switchUserAttributeBrand(newValue)
      setSelectedBrand(newValue);
    }
  };


  return (
    <div className={`${classes.zIndex1500}`}>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
        {/* <Avatar className={`${classes.mr12}`}>{userProfile.givenName.substring(0, 1)}</Avatar> */}
        <Avatar alt={userProfile.name} src={userProfile.imageUrl} className={classes.mr12} />

        <Typography>
          {typeof lookerUser.user_attributes.permission_level === 'string' ?
            lookerUser.user_attributes.permission_level.charAt(0).toUpperCase() + lookerUser.user_attributes.permission_level.substring(1) : ''}
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
        <MenuItem autoFocus={false} onClick={() => handleClose('basic')}>Basic</MenuItem>
        <MenuItem autoFocus={false} onClick={() => handleClose('advanced')}>Advanced</MenuItem>
        <MenuItem autoFocus={false} onClick={() => handleClose('premium')}>Premium</MenuItem>
        <Divider className={classes.divider} />
        {/* <MenuItem onClick={() => { toggleShow() }}>Highlight Source</MenuItem>
        <Divider className={classes.divider} /> */}
        <MenuItem onClick={() => handleClose(null)}>Sign Out</MenuItem>
        <Divider className={classes.divider} />
        <MenuItem>Current brand: {selectedBrand}</MenuItem>
        <MenuItem>

          <Autocomplete
            id="combo-box-usermenu"
            options={lookerUserAttributeBrandOptions}
            getOptionLabel={(option) => option.label}
            style={{ width: 300 }}
            onChange={(event) => handleClose(event.target.innerText || '')}
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
