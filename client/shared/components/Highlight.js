import React, { useContext } from 'react';
import { Chip } from '@material-ui/core';
import { appContextMap } from '../utils/tools';

// maybe move this to config?
export const API_COLOR = '#A142F4'
export const API_BACKGROUND_COLOR = 'rgba(161, 66, 244, 0.1)'
export const EMBED_COLOR = '#12B5CB'
export const EMBED_BACKGROUND_COLOR = 'rgba(18, 181, 203, 0.1)'
export const EMBED_METHOD_COLOR = '#297AF4'
export const EMBED_METHOD_BACKGROUND_COLOR = 'rgba(41, 122, 244, 0.1)'

function Highlight({ children, color, height, width, margin, id, backgroundColor, ...props }) {
  const { highlightShow } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  var style = {};
  if (highlightShow) {
    style = {
      ...style,
      border: `3px solid ${color}`,
      backgroundColor: `${backgroundColor}`,
      borderRadius: `4px`,
      position: 'relative',
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


  return (
    <div id={id} style={style}
    // {...props}
    >
      {children}
    </div>
  );
}

export function ApiHighlight({ ...props }) {
  const { highlightShow } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]); //useContext(AppContext)
  const { classes } = props
  const { children } = props

  return <Highlight {...props} color={API_COLOR} backgroundColor={API_BACKGROUND_COLOR}>

    <Chip size="small"
      label={"API"}
      className={highlightShow ? 'test' : `${classes.hidden}`}
      display="inline"
      align="right"
      style={{ backgroundColor: "#A142F4", color: '#fff', top: '-10px', left: '-10px', position: 'absolute' }}
    />
    {children}

  </Highlight>
}

export function EmbedHighlight({ ...props }) {
  const { highlightShow } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]); //useContext(AppContext)

  const { classes } = props
  const { children } = props

  return <Highlight {...props} color={EMBED_COLOR} backgroundColor={EMBED_BACKGROUND_COLOR}>

    <Chip size="small"
      label={"Embed"}
      className={highlightShow ? 'test' : `${classes.hidden}`}
      display="inline"
      align="right"
      style={{
        backgroundColor: "#12B5CB",
        color: '#fff',
        top: '-10px',
        left: '-10px',
        position: 'absolute',
      }}
    />
    {children}

  </Highlight>
}

export function EmbedMethodHighlight({ ...props }) {
  const { highlightShow } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]); //useContext(AppContext)
  const { classes } = props
  const { children } = props

  return <Highlight {...props} color={EMBED_METHOD_COLOR} backgroundColor={EMBED_METHOD_BACKGROUND_COLOR}>

    <Chip size="small"
      label={"Embed Method"}
      className={highlightShow ? 'test' : `${classes.hidden}`}
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
