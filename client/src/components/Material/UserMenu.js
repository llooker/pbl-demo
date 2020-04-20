import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';

const { validIdHelper } = require('../../tools');

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: 12
    }
}))

export default function UserMenu(props) {
    // console.log('UserMenu')
    // console.log('props', props)
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (newUser) => {
        setAnchorEl(null);
        if (newUser == null) {
            // console.log('inside this ifff')
            onLogoutSuccess({})
        }
        else if (typeof newUser === 'string') switchLookerUser(newUser)
    };

    const { lookerUser, switchLookerUser, onLogoutSuccess } = props
    const classes = useStyles();

    return (
        <div>
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
                {lookerUser.permission_level === 'good' ? '' : <MenuItem onClick={() => handleClose('good')}>Good</MenuItem>}
                {lookerUser.permission_level === 'better' ? '' : <MenuItem onClick={() => handleClose('better')}>Better</MenuItem>}
                {lookerUser.permission_level === 'best' ? '' : <MenuItem onClick={() => handleClose('best')}>Best</MenuItem>}
                <MenuItem onClick={() => handleClose(null)}>Sign Out</MenuItem>
            </Menu>
        </div>
    );
}
