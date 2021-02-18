import HomeIcon from '@material-ui/icons/Home';
import { Dashboard } from '@pbl-demo/components';


export const HomeContent = {
  "type": "dashboard",
  "label": "Home",
  "menuCategory": "Home",
  "description": "Overview of all your web traffic",
  "icon": HomeIcon,
  "component": Dashboard,
  "lookerContent": [
    {
      "type": "dashboard",
      "lookerMethod": "embedDashboard",
      "id": "18",
      "label": "Trends",
      "isNext": false,
      "theme": "vision_theme"
    }],
  "requiredPermissionLevel": 0
}