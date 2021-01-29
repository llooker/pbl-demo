import { EmbeddedExplore } from "@pbl-demo/components";
import ExploreIcon from '@material-ui/icons/Explore';

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
      "label": "Explore Applications"
    }],
  "requiredPermissionLevel": 1
}