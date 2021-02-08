import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import Dashboard from '@pbl-demo/components/Dashboard/Dashboard'

const createCaseButton = {
  label: "Create Case",
  component: "actionbutton",
  // options
}


export const ApplicationContent = {
  "type": "dashboard",
  "label": "Application",
  "menuCategory": "Home",
  "description": "Overview of all your web traffic",
  "icon": AssignmentIndIcon,
  "component": Dashboard,
  "lookerContent": [
    {
      "type": "dashboard",
      "lookerMethod": "embedDashboard",
      "id": "22",
      "label": "Application",
      "isNext": false,
      "theme": "vision_theme",
      // "filters": []//[createCaseButton]
    }],
  "requiredPermissionLevel": 0
}