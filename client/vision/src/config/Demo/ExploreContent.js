import { EmbeddedExplore } from "@pbl-demo/components";
import ExploreIcon from '@material-ui/icons/Explore';

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
      "qid": "UPggDGDP7v9urxCS4C2Paj"
    }],
  "requiredPermissionLevel": 1,
}