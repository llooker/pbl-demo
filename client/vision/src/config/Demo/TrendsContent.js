import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import { Dashboard } from '@pbl-demo/components';
import { SwitchTheme } from '@pbl-demo/components/Filters';
import { EmbedHighlight } from '@pbl-demo/components/Accessories';
import { handleThemeChange } from '@pbl-demo/components/Dashboard/helpers'

const themeFilter = {
  "label": "Show or hide native filters",
  "method": handleThemeChange,
  "methodName": "handleNativeFilterThemeChange",
  "component": SwitchTheme,
  "highlightComponent": EmbedHighlight,
  "gridWidth": 12,
  "options": { true: "Native filters", false: "Custom filters" },
}

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
      "slug": "JGZrjlmRxhLKNXJB17Vbo1",
      "label": "Trends",
      "isNext": false,
      "theme": "vision_light_arial_filters",
      "adjacentContainer": {
        "gridWidth": 1,
        "items": [themeFilter],
        "label": "Customize",
      },
      "themeable": true
    }],
  "requiredPermissionLevel": 0
}