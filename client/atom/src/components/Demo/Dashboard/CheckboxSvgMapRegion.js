import { CheckboxSVGMap } from "react-svg-map";
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash'

CheckboxSVGMap.prototype.toggleLocation = function toggleLocation(event) {
  const location = event.target;
  // console.log('location', location)
  // console.log('this.props.map', this.props.map)

  this.setState(prevState => {

    // Copy old state
    let selectedLocations = [...prevState.selectedLocations];
    // console.log('selectedLocations', selectedLocations)
    // console.log('selectedLocations.length', selectedLocations.length)

    //get region associated with states
    let regionFromStateClicked = _.find(this.props.map.locations, { id: location.id })
    //all states belonging to region clicked
    let statesWithinRegionClicked = _.filter(this.props.map.locations, { region: regionFromStateClicked.region })

    //get all unique regions
    let allUniqueRegions = [];
    for (let i = 0; i < this.props.map.locations.length; i++) {
      if (allUniqueRegions.indexOf(this.props.map.locations[i].region) == -1) {
        allUniqueRegions.push(this.props.map.locations[i].region)
      }
    }
    //get unique regions only from selected locations
    let allUniqueRegionsFromSelectedLocations = [];
    for (let j = 0; j < selectedLocations.length; j++) {
      if (allUniqueRegionsFromSelectedLocations.indexOf(selectedLocations[j].region) == -1) {
        allUniqueRegionsFromSelectedLocations.push(selectedLocations[j].region)
      }
    }
    //determine which regions are not currently selected
    let regionsNotCurrentlySelected = _.differenceBy(allUniqueRegions, allUniqueRegionsFromSelectedLocations);
    let allRegionsNotSelected = [...regionsNotCurrentlySelected, regionFromStateClicked.region];
    //filter all locations, for all the regions that have not been selected :D
    let statesNotWithinRegionsClicked = _.filter(this.props.map.locations, (location) => {
      return allRegionsNotSelected.indexOf(location.region) == -1
    });

    if (location.attributes['aria-checked'].value === 'true') {
      // Delete location
      selectedLocations = statesNotWithinRegionsClicked;
    } else {
      // Add location
      selectedLocations.push(...statesWithinRegionClicked);
    }

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
