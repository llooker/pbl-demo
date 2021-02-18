
import ExploreIcon from '@material-ui/icons/Explore';
import { EmbeddedExplore } from "@pbl-demo/components";
import { ActionButton } from '@pbl-demo/components'
import { createEmbeddedExplore } from '@pbl-demo/components/Explore/helpers'

const savedQueriesButton = {
  "label": "Saved Queries",
  "type": "Button",
  "component": ActionButton,
  "method": createEmbeddedExplore,
  "methodName": "createEmbeddedExploreNoQid",
  "gridWidth": 3
}

const defaultQueryButton = {
  "label": "Default Query",
  "type": "Button",
  "component": ActionButton,
  "method": createEmbeddedExplore,
  "methodName": "createEmbeddedExploreWithQid",
  "gridWidth": 3
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
      "actions": [
        savedQueriesButton, defaultQueryButton
      ]
    }],
  "requiredPermissionLevel": 1,
}