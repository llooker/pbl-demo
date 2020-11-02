import React, { useContext } from 'react';
import clsx from 'clsx';
import {
  AppBar, Toolbar, Badge, Avatar, IconButton
} from '@material-ui/core/';
import { AddAlert, ChevronLeft, Menu } from '@material-ui/icons';
import { endSession } from '../../AuthUtils/auth';
import AppContext from '../../contexts/AppContext';
import { useStyles, } from './styles.js';

import UserMenu from './UserMenu';


export default function TopBar(props) {


  const classes = useStyles();

  let { clientSession, setClientSession,
    drawerOpen, setDrawerOpen,
    activeUsecase } = useContext(AppContext)

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar)}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => setDrawerOpen(!drawerOpen)}
          edge="start"
        >
          {drawerOpen ? <ChevronLeft /> : <Menu />}
        </IconButton>

        {activeUsecase ?
          <Avatar alt="Icon"
            src={require(`../../images/${activeUsecase}.svg`)}
            variant="square"
          /> : ''}

        <Badge badgeContent={3} color="error" className={`${classes.mlAuto} ${classes.mr12} `} >
          <AddAlert />
        </Badge>
        <UserMenu />
      </Toolbar>
    </AppBar>
  )
}

