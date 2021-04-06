import React from 'react';
import { List } from '@material-ui/core';
const { validIdHelper, appContextMap } = require('../utils/tools');

export function InlineList({ classes, apiContent, item, ItemComponent }) {
  // console.log("InlineList")
  // console.log({ classes })


  return (

    < List
      className={classes.inlineList}
      component="div"
      disablePadding
    >
      {apiContent[item.apiKey].map((apiItem, index) => {

        return (
          <ItemComponent
            key={validIdHelper(`${apiItem.label}-trendItem-${index}`)}
            id={validIdHelper(`${apiItem.label}-trendItem-${index}`)}
            apiItem={apiItem}
            item={item}
            classes={classes}
            index={index}
          />
        )
      })}
    </List>
  )
}
