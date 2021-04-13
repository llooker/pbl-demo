
import ExploreIcon from '@material-ui/icons/Explore';
import { EmbeddedExplore } from "@pbl-demo/components";
import { ToggleButton } from '@pbl-demo/components/Filters'
import { createEmbeddedExplore } from '@pbl-demo/components/Explore/helpers'
import { EmbedMethodHighlight } from '@pbl-demo/components/Accessories';

const savedDefaultQueriesToggle = {
  // "label": "Starting Points:",
  "options": [
    "Default Query",
    "Saved Queries",
  ],
  "value": "toggleValue",
  "component": ToggleButton,
  "method": createEmbeddedExplore,
  "highlightComponent": EmbedMethodHighlight
}

export const ExploreContent = {
  "type": "explore",
  "label": "Explore",
  "menuCategory": "Home",
  "description": "Overview of all your web traffic",
  "icon": ExploreIcon,
  "component": EmbeddedExplore,
  "lookerContent": [
    {
      "type": "explore",
      "id": "vision::application",
      "label": "Explore Applications",
      // "qid": "UPggDGDP7v9urxCS4C2Paj",
      // "adjacentContainer": {
      //   "gridWidth": 12,
      //   "items": [savedDefaultQueriesToggle],
      //   "label": "Starting Points",
      // }
    }],
  "requiredPermissionLevel": 1,
}