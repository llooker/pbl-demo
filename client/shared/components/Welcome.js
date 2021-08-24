import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';
import { NaturalLanguage } from './NaturalLanguage';
import { validIdHelper, appContextMap } from '../utils/tools';

export function Welcome({ lookerContentItem, classes }) {
  // console.log('Welcome')
  const { clientSession } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const { userProfile } = clientSession

  return (
    <div
      className={`${classes.overflowScroll} ${classes.padding15}`}
      style={{ maxHeight: lookerContentItem.height }}
    >
      <Typography variant="h4">Welcome back, {userProfile.givenName}!</Typography>
    </div >
  );
}
