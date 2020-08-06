import React, { useContext } from 'react';
import AppContext from '../../AppContext';
import zIndex from '@material-ui/core/styles/zIndex';

// maybe move this to config?
export const API_COLOR = '#A142F4'
export const API_BACKGROUND_COLOR = 'rgba(161, 66, 244, 0.1)'
export const EMBED_COLOR = '#12B5CB'
export const EMBED_BACKGROUND_COLOR = 'rgba(18, 181, 203, 0.1)'

function Highlight({ children, color, height, width, margin, id, backgroundColor, ...props }) {
  const { show } = useContext(AppContext)
  var style = {};
  if (show) {
    style = {
      ...style,
      // boxShadow: `0 0 10px ${color}, 
      // inset 0 0 10px ${color}`,

      border: `3px solid ${color}`,
      backgroundColor: `${backgroundColor}`,
      borderRadius: `4px`,
      // zIndex: 10000000000000000,
    }
  } else {
    style = {
      border: `3px solid transparent`,
      backgroundColor: `transparent`,
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
  const { show } = useContext(AppContext)

  return <Highlight {...props} color={API_COLOR} backgroundColor={API_BACKGROUND_COLOR}>
  </Highlight>
}

export function EmbedHighlight({ ...props }) {
  const { show } = useContext(AppContext)

  return <Highlight {...props} color={EMBED_COLOR} backgroundColor={EMBED_BACKGROUND_COLOR}>
  </Highlight>
}
