import React, { useContext } from 'react';
import { Chip } from '@material-ui/core';
import { OpenInNew } from '@material-ui/icons';
import { appContextMap } from '../../utils/tools';

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

const apiDocsLink = "https://docs.looker.com/reference/api-and-integration/api-getting-started";
const embedDocsLink = "https://docs.looker.com/reference/embed-sdk/embed-sdk-intro";
const visComponentDocsLink = "https://docs.looker.com/data-modeling/extension-framework/vis-components";

function Highlight({ children, 
  color, 
  height, 
  width, 
  margin, 
  id, 
  transparentColor, 
  label,
  classes,
  link, ...props }) {

  const { highlightShow } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  var style = {};
  if (highlightShow) {
    style = {
      ...style,
      border: `3px solid ${color}`,
      backgroundColor: `${transparentColor}`,
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
    <div style={style}
    >
    <Chip size="small"
      label={label}
      className={highlightShow ? 'test' : `${classes.hidden}`}
      style={{
        color: '#fff',
        top: '0px',
        left: '0px',
        position: 'absolute',
        borderRadius: '0px 0px 8px 0px',
        backgroundColor: color,
        zIndex: 1000,
        cursor: 'pointer'
      }}
      icon={link ? <OpenInNew 
        style={{ color: '#fff'}}/> : ""}
      onClick={() => {link ? 
        window.open(link,'_blank')
        : ""}}
    />
      {children}
    </div>
  );
}

export function ApiHighlight({ ...props }) {
  const { children } = props

  return <Highlight {...props} 
    color={API_COLOR} 
    transparentColor={API_BACKGROUND_COLOR}
    label="API"
    link={apiDocsLink}
    >
    {children}
  </Highlight>
}

export function EmbedHighlight({ ...props }) {
  const { children } = props

  return <Highlight {...props}
    color={EMBED_COLOR}
    transparentColor={EMBED_BACKGROUND_COLOR}
    label="Embed"
    link={embedDocsLink}
  >
    {children}
  </ Highlight>
}

export function EmbedMethodHighlight({ ...props }) {
  const { children } = props

  return <Highlight {...props} 
    color={EMBED_METHOD_COLOR} 
    transparentColor={EMBED_METHOD_BACKGROUND_COLOR}
    label="Embed Method"
    link={embedDocsLink}
    >
    {children}
  </Highlight>
}

export function CloudFunctionHighlight({ ...props }) {
  const { children } = props
  return <Highlight {...props} 
    color={CLOUD_FUNCTION_COLOR} 
    transparentColor={CLOUD_FUNCTION_BACKGROUND_COLOR}
    label="Cloud Function">
    {children}
  </Highlight>
}

export function VisComponentHightlight({ ...props }) {
  const { children } = props
  return <Highlight {...props} 
    color={VIS_COMPONENT_COLOR} 
    transparentColor={VIS_COMPONENT_BACKGROUND_COLOR}
    label="Vis Component"
    link={visComponentDocsLink}
    >
    {children}
  </Highlight>
}
