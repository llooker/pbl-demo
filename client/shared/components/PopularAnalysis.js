import React, { useState } from 'react';
import { Typography, Card, Grid } from '@material-ui/core';
import { VectorThumbnail } from './VectorThumbnail';

const { validIdHelper } = require('../utils/tools');

export function PopularAnalysis({ lookerContent, classes }) {
  const [apiContent, setApiContent] = useState([]);

  return (

    <Card className={`${classes.padding15} 
    ${classes.overflowHidden} 
    ${classes.lookerCardShadow}
    `}
    >
      <div
        className={`${classes.overflowYScroll}`}
        style={{ height: lookerContent.height }}
      >
        <Grid container
          spacing={3}>
          <Grid item sm={12}>
            <Typography variant="h6" align="center" color="secondary">
              Helpful Dashboards
          </Typography></Grid>
          {lookerContent.vectors.map((item, index) => {
            return (
              <VectorThumbnail
                key={`${validIdHelper('vectorThumbnail-splashPage-' + index)}`}
                {...{ lookerContent, item, classes, index }}
              />
            )
          }
          )}
        </Grid>

      </div >
    </Card>
  );
}
