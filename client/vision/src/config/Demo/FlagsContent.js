import FlagIcon from '@material-ui/icons/Flag';
import Dashboard from '@pbl-demo/components/Dashboard/Dashboard'

export const FlagsConent = {
  "type": "dashboard",
  "label": "Flags",
  "menuCategory": "Home",
  "description": "Overview of all your web traffic",
  "icon": FlagIcon,
  "component": Dashboard,
  "lookerContent": [
    {
      "type": "dashboard",
      "lookerMethod": "embedDashboard",
      "id": "20",
      "label": "Flags",
      "isNext": false,
      "theme": "vision_theme"
    }],
  "requiredPermissionLevel": 1
}