import React from 'react';
import { Typography, Divider } from '@material-ui/core';

export const NotesList = ({ filterItem, apiContent, classes }) => {

  // console.log("NotesList")
  // console.log({ filterItem })
  // console.log({ apiContent })

  let HighlightComponent = filterItem.highlightComponent || EmbedMethodHighlight;
  let { apiKey, inlineQuery: { fields } } = filterItem;

  return (
    apiContent.hasOwnProperty(filterItem.apiKey) ?
      <div className={classes.maxHeight250}>
        <HighlightComponent classes={classes} >
          <Typography variant="subtitle1">{filterItem.label}</Typography>
          {apiContent[apiKey][0][fields[0]] ? apiContent[apiKey].map(apiItem => {
            return (
              <>
                <Typography color="secondary">{apiItem[fields[0]]}</Typography>
                <Typography >{apiItem[fields[1]]}</Typography>
                <Divider />
              </>
            )
          }) :
            <Typography>None</Typography>}
        </HighlightComponent> </div> : ""
  );
}
