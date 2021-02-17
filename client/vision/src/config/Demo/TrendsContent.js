import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import Dashboard from '@pbl-demo/components/Dashboard/Dashboard'

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