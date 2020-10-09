import React, { useContext } from 'react';
import AppContext from '../../AppContext';
import zIndex from '@material-ui/core/styles/zIndex';
import { Chip, Fade } from '@material-ui/core';


// maybe move this to config?
export const API_COLOR = '#A142F4'
export const API_BACKGROUND_COLOR = 'rgba(161, 66, 244, 0.1)'
export const EMBED_COLOR = '#12B5CB'
export const EMBED_BACKGROUND_COLOR = 'rgba(18, 181, 203, 0.1)'
export const EMBED_METHOD_COLOR = '#297AF4'
export const EMBED_METHOD_BACKGROUND_COLOR = 'rgba(41, 122, 244, 0.1)'

function Highlight({ children, color, height, width, margin, id, backgroundColor, ...props }) {
  // console.log('Highlight')
  // console.log('props', props)
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
      position: 'relative',
      // padding: '10px'
    }
  } else {
    style = {
      border: `3px solid transparent`,
      backgroundColor: `transparent`,
      // padding: '10px'
    }
  }

  if (height) { style['height'] = height }
  if (width) { style['width'] = width }
  if (margin) { style['margin'] = margin }

  // boxShadow: `0 4px 80px ${color}22`

  return (
    <div id={id} style={style}
    // {...props}
    >
      {children}
    </div>
  );
}

export function ApiHighlight({ ...props }) {
  const { show } = useContext(AppContext)
  const { classes } = props
  const { children } = props

  return <Highlight {...props} color={API_COLOR} backgroundColor={API_BACKGROUND_COLOR}>

    <Chip size="small"
      label={"API"}
      className={show ? 'test' : `${classes.hidden}`}
      display="inline"
      align="right"
      style={{ backgroundColor: "#A142F4", color: '#fff', top: '-10px', left: '-10px', position: 'absolute' }}
    />
    {children}

  </Highlight>
}

export function EmbedHighlight({ ...props }) {
  const { show } = useContext(AppContext)
  const { classes } = props
  const { children } = props

  return <Highlight {...props} color={EMBED_COLOR} backgroundColor={EMBED_BACKGROUND_COLOR}>

    <Chip size="small"
      label={"Embed"}
      className={show ? 'test' : `${classes.hidden}`}
      display="inline"
      align="right"
      style={{
        backgroundColor: "#12B5CB",
        color: '#fff',
        top: '-10px',
        left: '-10px',
        position: 'absolute'
      }}
    />
    {children}

  </Highlight>
}

export function EmbedMethodHighlight({ ...props }) {
  const { show } = useContext(AppContext)
  const { classes } = props
  const { children } = props

  return <Highlight {...props} color={EMBED_METHOD_COLOR} backgroundColor={EMBED_METHOD_BACKGROUND_COLOR}>

    <Chip size="small"
      label={"Embed Method"}
      className={show ? 'test' : `${classes.hidden}`}
      display="inline"
      align="right"
      style={{
        backgroundColor: "#297AF4",
        color: '#fff',
        top: '-10px',
        left: '-10px',
        position: 'absolute'
      }}
    />
    {children}

  </Highlight>
}
