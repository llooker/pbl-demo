
import ExploreIcon from '@material-ui/icons/Explore';
import { EmbeddedExplore } from "@pbl-demo/components";
import { ToggleButton } from '@pbl-demo/components/Filters'
import { createEmbeddedExplore } from '@pbl-demo/components/Explore/helpers'

const savedDefaultQueriesToggle = {
  "options": [
    "Default Query",
    "Saved Queries",
  ],
  "value": "tileToggleValue",
  "component": ToggleButton,
  "method": createEmbeddedExplore,
}

export const ExploreContent = {
  "type": "explore",
  "label": "Analyze",
  "menuCategory": "Home",
  "description": "Overview of all your web traffic",
  "icon": ExploreIcon,
  "component": EmbeddedExplore,
  "lookerContent": [
    {
      "type": "explore",
      "id": "vision::application",
      "label": "Explore Applications",
      "qid": "UPggDGDP7v9urxCS4C2Paj",
      "actions": [savedDefaultQueriesToggle]
    }],
  "requiredPermissionLevel": 1,
}