import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';
import { appContextMap } from '../utils/tools';

export function Welcome({ lookerContentItem, classes }) {
  const { clientSession } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  const { userProfile } = clientSession

  return (
    <div
      className={`${classes.padding15} ${classes.paddingB0}`}
      style={{ maxHeight: lookerContentItem.height }}
    >
      <Typography
        variant="h4"
        style={{ fontWeight: 300 }}
      >
        Welcome back, {userProfile.given_name}!
      </Typography>
    </div>
  );
}
