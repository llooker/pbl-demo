import React from 'react'
import { Grid, CircularProgress, Card } from '@material-ui/core'


export function Loader({ classes, height, expansionPanelHeight }) {
  return (
    <Grid item sm={12} style={{ height: height - 30 - expansionPanelHeight }}>
      <Card className={`${classes.card} ${classes.flexCentered}`}
        elevation={0}
        mt={2}
        style={{ height: height - 30 - expansionPanelHeight }}>
        <CircularProgress className={classes.circularProgress} />
      </Card>
    </Grid>
  )
}
