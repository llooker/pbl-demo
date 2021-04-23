import _ from 'lodash'
import React from 'react';
// import { withStyles } from '@material-ui/core/styles';
// import { green } from '@material-ui/core/colors';
import { FormGroup, FormControlLabel, Checkbox, Typography } from '@material-ui/core';

//research styled components
// const GreenCheckbox = withStyles({
//   root: {
//     color: green[400],
//     '&$checked': {
//       color: green[600],
//     },
//   },
//   checked: {},
// })((props) => <Checkbox color="default" {...props} />);

export const CheckboxLabels = ({ filterItem, action, classes }) => {
  // console.log("CheckboxLabels");
  // console.log({ filterItem });
  // console.log({ action });

  let stateObj = {};
  filterItem.options.map(item => {
    stateObj[item.value] = true
  })

  const [state, setState] = React.useState({ ...stateObj });

  const handleChange = (event) => {
    let newState = { ...state, [event.target.name]: event.target.checked };
    console.log({ newState })
    let newValueToUse = Object.keys(newState).map(key => {
      if (newState[key]) return key
    })
    newValueToUse = _.compact(newValueToUse).join(",");
    console.log({ newValueToUse })
    action(
      filterItem.filterName,
      newValueToUse)
    setState(newState);
  };

  let HighlightComponent = filterItem.highlightComponent || EmbedHighlight;

  console.log({ state })

  return (
    <HighlightComponent classes={classes}>
      <Typography className={`${classes.heading} ${classes.ml12}  ${classes.verticalAlignTop}`}>
        {filterItem.label}:
      </Typography>
      <FormGroup row>
        {filterItem.options.map(item => {
          let { value, label } = item
          return (
            <FormControlLabel
              control={
                <Checkbox
                  checked={state[value]}
                  onChange={handleChange}
                  name={value}
                />
              }
              label={_.startCase(label)}
            />
          )
        })}
      </FormGroup>
    </HighlightComponent>
  );
}

