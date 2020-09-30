import { CheckboxSVGMap } from "react-svg-map";

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

    if (location.attributes['aria-checked'].value === 'true') {
      // Delete location
      selectedLocations.splice(selectedLocations.indexOf(location), 1);
    } else {
      // Add location
      selectedLocations.push(location);
    }


    // Call onChange event handler
    if (this.props.onChange) {
      this.props.onChange(selectedLocations);
    }

    // Return new state
    return { selectedLocations };
  });
}

export { CheckboxSVGMap as CheckboxSVGMap } 
