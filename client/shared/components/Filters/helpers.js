import Usa from "@svg-maps/usa";
import {
  SentimentDissatisfied, SentimentSatisfied, SentimentVerySatisfied,
} from '@material-ui/icons';

export const customUsa = {
  ...Usa,
  label: "Custom map label",
  locations: Usa.locations.map(location => {
    // Modify each location
    switch (location.name) {
      //9
      case "Connecticut":
      case "Maine":
      case "Massachusetts":
      case "New Hampshire":
      case "Rhode Island":
      case "Vermont":
      case "New Jersey":
      case "New York":
      case "Pennsylvania":
      case "Delaware":
        return { ...location, region: "Northeast" }
      //12
      case "Illinois":
      case "Indiana":
      case "Michigan":
      case "Ohio":
      case "Wisconsin":
      case "Iowa":
      case "Kansas":
      case "Minnesota":
      case "Missouri":
      case "Nebraska":
      case "North Dakota":
      case "South Dakota":
        return { ...location, region: "Midwest" }
      //16
      case "Florida":
      case "Georgia":
      case "Maryland":
      case "North Carolina":
      case "South Carolina":
      case "Virginia":
      case "District of Columbia":
      case "Washington, DC":
      case "West Virginia":
      case "Alabama":
      case "Kentucky":
      case "Mississippi":
      case "Tennessee":
      case "Arkansas":
      case "Louisiana":
      case "Oklahoma":
      case "Texas":
        return { ...location, region: "South" }
      //8
      case "Arizona":
      case "Colorado":
      case "Idaho":
      case "Montana":
      case "Nevada":
      case "New Mexico":
      case "Utah":
      case "Wyoming":
        return { ...location, region: "Mountain" }
      //5
      case "Alaska":
      case "California":
      case "Hawaii":
      case "Oregon":
      case "Washington":
        return { ...location, region: "Pacific" }
      // default:
      //   return location
    }
  })
}
export const lifetimeRevenueTierMap = {
  "0 to 99": "low",
  "100 to 499": "medium",
  "500 or Above": "high",
}
export const lifetimeRevenueTierIconMap = {
  "0 to 99": SentimentDissatisfied,
  "100 to 499": SentimentSatisfied,
  "500 or Above": SentimentVerySatisfied,
}
