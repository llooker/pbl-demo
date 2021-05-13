import React, { useState } from 'react';
import { Typography, Card, Grid } from '@material-ui/core';
import { VectorThumbnail } from './VectorThumbnail';

const { validIdHelper } = require('../utils/tools');

export function PopularAnalysis({ lookerContentItem, classes }) {
  const [apiContent, setApiContent] = useState([]);

  return (

    <Card className={`${classes.padding15} ${classes.overflowHidden} `}
      elevation={0}
    >
      <div
        className={`${classes.overflowYScroll}`}
        style={{ height: lookerContentItem.height }}
      >
        <Grid container
          spacing={3}>
          <Grid item sm={12}>
            <Typography variant="h6" align="center" color="secondary">
              Helpful Dashboards
          </Typography></Grid>
          {lookerContentItem.vectors.map((vectorItem, index) => {
            return (
              <VectorThumbnail
                key={`${validIdHelper('vectorThumbnail-splashPage-' + index)} `}
                {...{ lookerContentItem, vectorItem, classes, index }}
              />
            )
          }
          )}
        </Grid>
      </div >
    </Card>
  );
}
