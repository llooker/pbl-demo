import _ from 'lodash'
import React from 'react';
// import { withStyles } from '@material-ui/core/styles';
// import { green } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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
    stateObj[[`checked${_.startCase(item)}`]] = true
  })

  const [state, setState] = React.useState({ ...stateObj });

  const handleChange = (event) => {
    let newState = { ...state, [event.target.name]: event.target.checked };
    let newValueToUse = Object.keys(newState).map(key => {
      if (newState[key]) return key.split(/(?=[A-Z])/)[1][0]
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
      <FormGroup row>
        {filterItem.options.map(item => {
          let itemName = `checked${_.startCase(item)}`;
          return (
            <FormControlLabel
              control={
                <Checkbox
                  checked={state[itemName]}
                  onChange={handleChange}
                  name={itemName}
                />
              }
              label={_.startCase(item)}
            />
          )
        })}
      </FormGroup>
    </HighlightComponent>
  );
}

