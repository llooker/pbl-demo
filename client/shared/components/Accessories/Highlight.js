/**
 * TO DO: refactor
 * a lot of repetitive code
 */

import React, { useContext } from 'react';
import { Chip } from '@material-ui/core';
import { appContextMap } from '../../utils/tools';

// maybe move this to config?
export const API_COLOR = '#A142F4'
export const API_BACKGROUND_COLOR = 'rgba(161, 66, 244, 0.1)'
export const EMBED_COLOR = '#12B5CB'
export const EMBED_BACKGROUND_COLOR = 'rgba(18, 181, 203, 0.1)'
export const EMBED_METHOD_COLOR = '#297AF4'
export const EMBED_METHOD_BACKGROUND_COLOR = 'rgba(41, 122, 244, 0.1)'
export const CLOUD_FUNCTION_COLOR = '#f4a328'
export const CLOUD_FUNCTION_BACKGROUND_COLOR = 'rgba(244,163,40, 0.1)'
export const VIS_COMPONENT_COLOR = '#f42879'
export const VIS_COMPONENT_BACKGROUND_COLOR = 'rgba(244,40,121 0.1)'

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
      border: `0px solid transparent`,
      backgroundColor: `transparent`,
    }
  }

  if (height) { style['height'] = height }
  if (width) { style['width'] = width }
  if (margin) { style['margin'] = margin }


  return (
    <div id={id}
      style={style}
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
      style={{
        backgroundColor: API_COLOR,
        color: '#fff',
        top: '0px',
        right: '0px',
        position: 'absolute',
        borderRadius: '0px 0px 0px 8px',
        zIndex: 1000
      }}
    />
    {children}

  </Highlight>
}

export function EmbedHighlight({ ...props }) {
  const { highlightShow } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]); //useContext(AppContext)

  const { classes } = props
  const { children } = props

  return <Highlight {...props}
    color={EMBED_COLOR}
    backgroundColor={EMBED_BACKGROUND_COLOR}
  >

    <Chip size="small"
      label={"Embed"}
      className={highlightShow ? 'test' : `${classes.hidden}`}
      display="inline"
      align="right"
      style={{
        backgroundColor: "#12B5CB",
        color: '#fff',
        top: '0px',
        right: '0px',
        position: 'absolute',
        borderRadius: '0px 0px 0px 8px'
      }}
    />
    {children}

  </ Highlight>
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
        backgroundColor: EMBED_METHOD_COLOR,
        color: '#fff',
        top: '0px',
        right: '0px',
        position: 'absolute',
        borderRadius: '0px 0px 0px 8px'
      }}
    />
    {children}

  </Highlight>
}

export function CloudFunctionHighlight({ ...props }) {
  const { highlightShow } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]); //useContext(AppContext)
  const { classes } = props
  const { children } = props

  return <Highlight {...props} color={CLOUD_FUNCTION_COLOR} backgroundColor={CLOUD_FUNCTION_BACKGROUND_COLOR}>

    <Chip size="small"
      label={"Cloud Function"}
      className={highlightShow ? 'test' : `${classes.hidden}`}
      display="inline"
      align="right"
      style={{
        backgroundColor: CLOUD_FUNCTION_COLOR,
        color: '#fff',
        top: '0px',
        right: '0px',
        position: 'absolute',
        borderRadius: '0px 0px 0px 8px'
      }}
    />
    {children}

  </Highlight>
}

export function VisComponentHightlight({ ...props }) {
  const { highlightShow } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]); //useContext(AppContext)
  const { classes } = props
  const { children } = props

  return <Highlight {...props} color={VIS_COMPONENT_COLOR} backgroundColor={VIS_COMPONENT_BACKGROUND_COLOR}>

    <Chip size="small"
      label={"Visualization Component"}
      className={highlightShow ? 'test' : `${classes.hidden}`}
      display="inline"
      align="right"
      style={{
        backgroundColor: VIS_COMPONENT_COLOR,
        color: '#fff',
        top: '0px',
        right: '0px',
        position: 'absolute',
        borderRadius: '0px 0px 0px 8px'
      }}
    />
    {children}

  </Highlight>
}
