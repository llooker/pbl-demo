import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';
import AppContext from '../../../AppContext';
import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, CircularProgress, Grid, Divider, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { ApiHighlight } from '../../Highlights/Highlight';

const { validIdHelper } = require('../../../tools');



export function ContentCarousel({ lookerContent, classes }) {
  // console.log('Welcome')
  const { userProfile, lookerUser } = useContext(AppContext)

  useEffect(() => {
    // setClientSideCode(rawSampleCode)
  }, [lookerContent, lookerUser]);

  const backgroundImage1 = require(`../../../images/atom_splash_blog.jpg`)
  const backgroundImage2 = require(`../../../images/atom_splash_inventory.jpg`)
  const backgroundImage3 = require(`../../../images/atom_splash_trends.jpg`)


  return (
    <div
      className={`${classes.overflowHidden}  MuiPaper-rounded`}
      style={{
        maxHeight: lookerContent.height,
        borderRadius: '4px'
      }}
    >

      <Carousel infiniteLoop={true} autoPlay={true} showThumbs={false}>
        <div
          style={{
            maxHeight: lookerContent.height,
            // backgroundImage: `url(${backgroundImage1})`,
            // backgroundSize: 'cover'
          }}
        >
          <img src={require(`../../../images/atom_splash_blog.jpg`)} />
          <p className={`legend ${classes.carouselLegend}`}>Blog</p>
        </div>
        <div
          style={{
            maxHeight: lookerContent.height,
            // backgroundImage: `url(${backgroundImage2})`,
            // backgroundSize: 'cover'
          }}
        >
          <img src={require(`../../../images/atom_splash_inventory.jpg`)} />
          <p className={`legend ${classes.carouselLegend}`}>Inventory Best Practices</p>
        </div>
        <div
          style={{
            maxHeight: lookerContent.height,
            // backgroundImage: `url(${backgroundImage3})`,
            // backgroundSize: 'cover'
          }}
        >
          <img src={require(`../../../images/atom_splash_trends.jpg`)} />
          <p className={`legend ${classes.carouselLegend}`}>Macro Trends</p>
        </div>
      </Carousel>
    </div >
  );
}
