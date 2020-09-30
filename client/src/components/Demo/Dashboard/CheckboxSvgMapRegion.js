import { CheckboxSVGMap } from "react-svg-map";
import React from 'react';
import ReactDOM from 'react-dom';

CheckboxSVGMap.prototype.toggleLocation = function toggleLocation(event) {
  const location = event.target;

  this.setState(prevState => {

    let clickedStateId = location.id;
    let associatedRegion;
    this.props.map.locations.map(location => {
      if (location.id == clickedStateId) {
        associatedRegion = location.region
      }
    });

    let statesWithinRegion = []
    this.props.map.locations.map(location => {
      if (location.region == associatedRegion) {
        statesWithinRegion.push(location)
      }
    })

    // Copy old state
    let selectedLocations = [...statesWithinRegion]; //[...prevState.selectedLocations];

    // Call onChange event handler
    if (this.props.onChange) {
      this.props.onChange(selectedLocations);
    }

    // Return new state
    return { selectedLocations };
  });
}

CheckboxSVGMap.prototype.componentDidMount = function componentDidMount() {
  //override components for all states to be selected initially
  this.setState({ selectedLocations: this.props.map.locations });
}

export { CheckboxSVGMap as CheckboxSVGMap } 
