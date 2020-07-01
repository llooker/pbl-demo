import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AppContext from '../../AppContext';

const { validIdHelper } = require('../../tools');

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: 12
  },
  zIndex1500: {
    zIndex: 1500
  }
}))

export default function UserMenu(props) {
  // console.log('UserMenu')
  // console.log('props', props)

  const { lookerUser, switchLookerUser, onLogoutSuccess, lookerUserAttributeBrandOptions, switchUserAttributeBrand } = props
  const classes = useStyles();
  const { toggleShow } = useContext(AppContext)

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
        <AccountCircle className={classes.icon} />
        <Typography>
          {typeof lookerUser.permission_level === 'string' ?
            lookerUser.permission_level.charAt(0).toUpperCase() + lookerUser.permission_level.substring(1) : ''}
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
        <MenuItem onClick={() => { toggleShow() }}>Highlight Source</MenuItem>
        <Divider className={classes.divider} />
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
