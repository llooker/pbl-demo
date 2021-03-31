import React from 'react';
import { Typography, Link } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';

export function LinkText({ filterItem, classes }) {

  let HighlightComponent = filterItem.highlightComponent || EmbedMethodHighlight;
  return (
    <HighlightComponent classes={classes} >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <LinkIcon />
        <Link href="#" >
          {filterItem.label}
        </Link>
      </div>
    </HighlightComponent >
  );
}
