import React from 'react';
import { Typography, Divider } from '@material-ui/core';

const { validIdHelper } = require('../../utils/tools');

export const NotesList = ({ filterItem, apiContent, classes }) => {

  // console.log("NotesList")
  // console.log({ filterItem })
  // console.log({ apiContent })

  let HighlightComponent = filterItem.highlightComponent || EmbedMethodHighlight;
  let { inlineQuery: { fields } } = filterItem;

  return (
    <div key={validIdHelper(`dashEmbed-notesList-${filterItem.label}`)} className={classes.maxHeight250}>
      <HighlightComponent classes={classes} >
        <Typography variant="subtitle1">{filterItem.label}</Typography>
        {apiContent[0][fields[0]] ? apiContent.map((apiItem, index) => {
          return (
            <div key={validIdHelper(`dashEmbed-notesList-${filterItem.label}-${index}`)}>
              <Typography color="secondary">{apiItem[fields[0]]}</Typography>
              <Typography >{apiItem[fields[1]]}</Typography>
              <Divider />
            </div>
          )
        }) :
          <Typography>None</Typography>}
      </HighlightComponent> </div>
  );
}
