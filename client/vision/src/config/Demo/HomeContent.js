import Dashboard from '../../components/Demo/Dashboard/Dashboard'
import HomeIcon from '@material-ui/icons/Home';

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
      "label": "Home",
      "isNext": false
    }]
}