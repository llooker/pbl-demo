import FlagIcon from '@material-ui/icons/Flag';
import { Dashboard } from '@pbl-demo/components';
import { Button } from '@material-ui/core/';


const addCaseNotes = {
  "label": "Add Case Notes",
  "component": Button,
  // "gridWidth": 3
}


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
      "slug": "219Tk9NQ4sGSjGNsRSFKjG",
      "label": "Flags",
      "isNext": false,
      "theme": "vision_theme",
      "adjacentContainer": {
        "gridWidth": 12,
        "items": [addCaseNotes]
      }
    }],
  "requiredPermissionLevel": 1
}