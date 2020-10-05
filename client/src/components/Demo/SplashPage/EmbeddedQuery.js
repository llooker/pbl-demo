import $ from 'jquery';
import React, { useEffect, useRef, useCallback, useState, useContext } from 'react';
import AppContext from '../../../AppContext';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { ApiHighlight, EmbedHighlight } from '../../Highlights/Highlight';
import { Typography, Grid, Card, CircularProgress, Box, Chip } from '@material-ui/core';
import { urlencoded } from 'body-parser';

export function EmbeddedQuery({ lookerContent, classes, id }) {

  const [iFrameExists, setIFrame] = useState(0);
  const { userProfile, lookerUser, show, lookerHost } = useContext(AppContext)

  useEffect(() => {
    $(`#${id}`).html('')
    setIFrame(0)

    let queryUrl = encodeURIComponent(`embed/query/atom_fashion/order_items?fields=users.state,users.count&sorts=users.count+desc&limit=500&query_timezone=America%2FLos_Angeles&vis=%7B%22map%22%3A%22usa%22%2C%22map_projection%22%3A%22%22%2C%22show_view_names%22%3Afalse%2C%22quantize_colors%22%3Afalse%2C%22type%22%3A%22looker_geo_choropleth%22%2C%22map_plot_mode%22%3A%22points%22%2C%22heatmap_gridlines%22%3Afalse%2C%22heatmap_gridlines_empty%22%3Afalse%2C%22heatmap_opacity%22%3A0.5%2C%22show_region_field%22%3Atrue%2C%22draw_map_labels_above_data%22%3Atrue%2C%22map_tile_provider%22%3A%22light%22%2C%22map_position%22%3A%22fit_data%22%2C%22map_scale_indicator%22%3A%22off%22%2C%22map_pannable%22%3Atrue%2C%22map_zoomable%22%3Atrue%2C%22map_marker_type%22%3A%22circle%22%2C%22map_marker_icon_name%22%3A%22default%22%2C%22map_marker_radius_mode%22%3A%22proportional_value%22%2C%22map_marker_units%22%3A%22meters%22%2C%22map_marker_proportional_scale_type%22%3A%22linear%22%2C%22map_marker_color_mode%22%3A%22fixed%22%2C%22show_legend%22%3Atrue%2C%22quantize_map_value_colors%22%3Afalse%2C%22reverse_map_value_colors%22%3Afalse%2C%22defaults_version%22%3A1%2C%22series_types%22%3A%7B%7D%7D&filter_config=%7B%7D&origin=share-expanded&sdk=2&embed_domain=${document.location.origin}`)
    //need to implement logic for signed url
    console.log('queryUrl', queryUrl)

    async function fetchData() {
      // You can await here
      await fetch(`/auth?src=${queryUrl}`)
        .then(response => response.json())
        .then(data => {
          LookerEmbedSDK.createExploreWithUrl(data.url)
            .appendTo(document.getElementById(id))
            .withClassName('explore')
            .withClassName('splashPage')
            .withClassName(lookerContent.id)
            .withTheme('atom_fashion')
            .build()
            .connect()
            .then((explore) => {
              // console.log('then explore', explore)
              setIFrame(1)
              LookerEmbedSDK.init(`https://${lookerHost}.looker.com`);
            })
            .catch((error) => {
              // console.log('catch', error)
              console.error('Connection error', error)
            })
        });
      // ...

    }
    fetchData();

    // console.log('signedUrl', signedUrl)


  }, [lookerUser])

  return (

    <Card className={`${classes.padding15} 
    ${classes.overflowHidden} 
    ${classes.lookerCardShadow}
    `}
    // variant="outlined"
    >

      <div
        className={`${classes.overflowHidden}`}
        style={{ height: lookerContent.height }}
      >
        {
          iFrameExists ? '' :

            <Grid item sm={12} >
              <Card className={`${classes.card} ${classes.flexCentered} ${classes.maxHeight400} ${classes.overflowHidden}`} elevation={0}>
                <CircularProgress className={classes.circularProgress}
                />
              </Card>
            </Grid>
        }
        <Grid container spacing={3}>
          <Grid item sm={12}>
            <EmbedHighlight classes={classes}
              height={iFrameExists ? 400 : 0}
            >
              <div
                className={`embedContainer embedContainerNoHeader splashPage`}
                id={id}
                key={id}
              >
              </div>
            </EmbedHighlight>
          </Grid></Grid>
      </div >
    </Card >
  );
}