import React from 'react'
import { Grid, CircularProgress, Card } from '@material-ui/core'


export function Loader({ classes, height, hide }) {
  return (
    hide ? "" :
      <Grid item sm={12} style={{ height }
      } >
        <Card className={`${classes.card} ${classes.flexCentered}`}
          elevation={0}
          mt={2}
          style={{ height: `${height}px` }}
        >
          <CircularProgress className={classes.circularProgress} />
        </Card>
      </Grid >
  )
}
