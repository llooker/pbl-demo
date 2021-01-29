import Dashboard from '../../components/Demo/Dashboard/Dashboard'
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

export const TrendsContent = {
  "type": "dashboard",
  "label": "Trends",
  "menuCategory": "Home",
  "description": "Overview of all your web traffic",
  "icon": TrendingUpIcon,
  "component": Dashboard,
  "lookerContent": [
    {
      "type": "dashboard",
      "lookerMethod": "embedDashboard",
      "id": "19",
      "label": "Trends",
      "isNext": false,
      "theme": "vision_theme"
    }],
  "requiredPermissionLevel": 0
}