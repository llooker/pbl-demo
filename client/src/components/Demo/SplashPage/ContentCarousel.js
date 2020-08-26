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

  const legend1 = 'Blog...'
  const legend2 = 'Inventory Best Practices – McKinsey & Co found in a recent study that retailers who implement JIT inventory and fulfillment practices can result in 5 - 15% longer run operating margin vs similar competitors that don’t while maintaining similar CSAT scores'
  const legend3 = 'Macro Trends – Online and brick and mortar retailers are rapidly converging on Omni Channel where the traditional walls of retail vs online are blurred. Amazon partners with Kohls to create in person returns and Walmart acquires Jet.com to boost its reach and  ability to execute an online strategy. As a brand partner how do you capitalize on these trends?'


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
          <img src={backgroundImage1} />
          <p className={`legend ${classes.carouselLegend}`}>{legend1.substring(0, 30)}...</p>
        </div>
        <div
          style={{
            maxHeight: lookerContent.height,
            // backgroundImage: `url(${backgroundImage2})`,
            // backgroundSize: 'cover'
          }}
        >
          <img src={backgroundImage2} />
          <p className={`legend ${classes.carouselLegend}`}>{legend2.substring(0, 30)}...</p>
        </div>
        <div
          style={{
            maxHeight: lookerContent.height,
            // backgroundImage: `url(${backgroundImage3})`,
            // backgroundSize: 'cover'
          }}
        >
          <img src={backgroundImage3} />
          <p className={`legend ${classes.carouselLegend}`}>{legend3.substring(0, 30)}...</p>
        </div>
      </Carousel>
    </div >
  );
}
