import _ from 'lodash'
import React, { useState } from 'react';
import { FormGroup, Typography, Chip } from '@material-ui/core';
import { Done } from '@material-ui/icons';

export const ChipList = ({ filterItem, action, classes }) => {
  // console.log("ChipList");
  // console.log({ filterItem });
  // console.log({ action });

  let stateObj = {};
  filterItem.options.map(item => {
    stateObj[item.value] = true
  })

  const [state, setState] = useState({ ...stateObj });

  const handleChange = (event) => {
    // console.log("handleChange")
    // console.log({ event })
    // console.log('event.target.innerText', event.target.innerText)
    let chipClickedText = event.target.innerText;
    let newState = { ...state, [chipClickedText]: !state[chipClickedText] };
    let newValueToUse = Object.keys(newState).map(key => {
      if (newState[key]) return key
    })
    newValueToUse = _.compact(newValueToUse).join(",");
    action(
      filterItem.filterName,
      newValueToUse)
    setState(newState);
  };

  let HighlightComponent = filterItem.highlightComponent || EmbedHighlight;


  return (
    <HighlightComponent classes={classes}>
      <Typography className={`${classes.heading} ${classes.ml12}  ${classes.verticalAlignTop}`}>
        {filterItem.label}:
      </Typography>
      <FormGroup row>
        {filterItem.options.map(item => {
          let { value, label } = item
          return (
            <Chip
              key={item.label}
              label={item.label}
              datalabel={item.label}
              onClick={handleChange}
              icon={state[item.label] ? <Done /> : ''}
              style={item.color ? { "backgroundColor": item.color } : {}}
            />
          )
        })}
      </FormGroup>
    </HighlightComponent>
  );
}

