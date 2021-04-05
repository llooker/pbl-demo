import React from 'react';
import { Typography } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import { Link } from "react-router-dom";

export function LinkText({ filterItem, classes, apiContent }) {
  // console.log("LinkText")
  // console.log({ filterItem })
  // console.log({ apiContent })

  let { inlineQuery: { fields } } = filterItem;
  let HighlightComponent = filterItem.highlightComponent || EmbedMethodHighlight;

  /*

                <ListItem
                  button
                  className={`${classes.nested} ${classes.rightRoundedTab}`}
                  key={`${validIdHelper(outerItem + '-innerListItem-' + innerIndex)}`}
                  selected={validIdHelper(_.lowerCase(item.label)) === selectedMenuItem}
                  component={Link}
                  to={validIdHelper(_.lowerCase(item.label))}
                >
  */
  return (
    <HighlightComponent classes={classes} >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <LinkIcon />
        <Typography
          component={Link}
          to={`${filterItem.staticHref}${apiContent[0][fields[1]]}`} >
          {filterItem.label}
        </Typography>
      </div>
    </HighlightComponent >
  );
}
