import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';
import AppContext from '../../../AppContext';
import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, CircularProgress, Grid, Divider } from '@material-ui/core';
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

  return (
    <div
      className={`${classes.overflowScroll}`}
      style={{ height: lookerContent.height }}
    >

      <Carousel infiniteLoop={true} autoPlay={true} showThumbs={false}>
        <div style={{ maxHeight: lookerContent.height }}>
          <img src={require(`../../../images/atom_splash_blog.jpg`)} />
          <p className="legend">Blog</p>
        </div>
        <div style={{ maxHeight: lookerContent.height }}>
          <img src={require(`../../../images/atom_splash_inventory.jpg`)} />
          <p className="legend">Inventory Best Practices</p>
        </div>
        <div style={{ maxHeight: lookerContent.height }}>
          <img src={require(`../../../images/atom_splash_trends.jpg`)} />
          <p className="legend">Macro Trendsssss</p>
        </div>
      </Carousel>
    </div >
  );
}
