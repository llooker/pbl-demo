import Dashboard from '../../components/Demo/Dashboard/Dashboard'
import PeopleIcon from '@material-ui/icons/People';

export const HouseholdsContent = {
  "type": "dashboard",
  "label": "Households",
  "menuCategory": "Home",
  "description": "Overview of all your web traffic",
  "icon": PeopleIcon,
  "component": Dashboard,
  "lookerContent": [
    {
      "type": "dashboard",
      "lookerMethod": "embedDashboard",
      "id": "21",
      "label": "Households",
      "isNext": false,
      "filterName": "Household ID"
    }],
  "requiredPermissionLevel": 1
}