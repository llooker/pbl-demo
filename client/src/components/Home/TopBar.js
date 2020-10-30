import React from 'react'
import clsx from 'clsx';
import {
  AppBar, Toolbar, Typography, Badge, Avatar, IconButton
} from '@material-ui/core/';
import { AddAlert, ShowChart, VisibilityOutlined, DateRangeOutlined, Search, FindInPage, Code, TableChartOutlined, LibraryBooksOutlined, Menu, ChevronLeft } from '@material-ui/icons';


export default function TopBar(props) {
  const { classes, activeUsecase, lookerUser, applySession, lookerUserAttributeBrandOptions, handleUserMenuSwitch, drawerOpen, handleDrawerChange } = props

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar)}
    // className={clsx(classes.appBar, {
    //   [classes.appBarShift]: drawerOpen,
    // })}
    >
      <Toolbar>

        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => handleDrawerChange(!drawerOpen)}
          edge="start"
        // className={clsx(classes.menuButton, drawerOpen && classes.hide)}
        >
          {drawerOpen ? <ChevronLeft /> : <Menu />}
          {/* <Menu /> */}
        </IconButton>

        {activeUsecase ?
          <Avatar alt="Icon"
            src={require(`../../images/${activeUsecase}.svg`)}
            variant="square"
          /> : ''}

        <Badge badgeContent={3} color="error" className={`${classes.mlAuto} ${classes.mr12} `} >
          <AddAlert />
        </Badge>
        {/* <UserMenu
          lookerUser={lookerUser}
          onLogoutSuccess={applySession}
          lookerUserAttributeBrandOptions={lookerUserAttributeBrandOptions}
          handleUserMenuSwitch={handleUserMenuSwitch}
        /> */}
      </Toolbar>
    </AppBar>
  )
}

