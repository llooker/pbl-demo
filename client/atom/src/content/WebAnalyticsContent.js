import Dashboard from '../components/Demo/Dashboard/Dashboard'
import ShowChartIcon from '@material-ui/icons/ShowChart';

export const WebAnalyticsContent = {
  "type": "simple dashboard",
  "label": "Web Analytics",
  "menuCategory": "marketing",
  "icon": ShowChartIcon,
  "description": "Overview of all your web traffic",
  "component": Dashboard,
  "lookerContent": [
    {
      "type": "dashboard",
      "lookerMethod": "embedDashboard",
      "id": "9",
      "label": "Web Analytics",
      "isNext": false,
      "theme": "atom_fashion_filters"
    }
  ]
}