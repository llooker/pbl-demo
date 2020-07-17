import React, { useContext } from 'react';
import AppContext from '../../AppContext';
import zIndex from '@material-ui/core/styles/zIndex';

// maybe move this to config?
export const API_COLOR = '#FF0000'
export const EMBED_COLOR = '#0000FF'

function Highlight({ children, color, height, width, margin, id, ...props }) {
  const { show } = useContext(AppContext)
  var style = {};
  if (show) {
    style = {
      ...style,
      boxShadow: `0 0 10px ${color}, 
      inset 0 0 10px ${color}`,
      zIndex: 1000000
    }
  }

  if (height) { style['height'] = height }
  if (width) { style['width'] = width }
  if (margin) { style['margin'] = margin }

  // boxShadow: `0 4px 80px ${color}22`

  return (
    <div id={id} style={style} {...props}>
      {children}
    </div>
  );
}

export function ApiHighlight({ ...props }) {
  return <Highlight {...props} color={API_COLOR}></Highlight>
}

export function EmbedHighlight({ ...props }) {
  return <Highlight {...props} color={EMBED_COLOR}></Highlight>
}
