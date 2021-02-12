import PeopleIcon from '@material-ui/icons/People';
import Dashboard from '@pbl-demo/components/Dashboard/Dashboard'

export const BeneficiaryContent = {
  "type": "dashboard",
  "label": "Beneficiary",
  "menuCategory": "Home",
  "description": "Overview of all your web traffic",
  "icon": PeopleIcon,
  "component": Dashboard,
  "lookerContent": [
    {
      "type": "dashboard",
      "lookerMethod": "embedDashboard",
      "id": "21",
      "label": "Beneficiary",
      "isNext": false,
      "filterName": "Person ID",
      "theme": "vision_theme"
    }],
  "requiredPermissionLevel": 1
}