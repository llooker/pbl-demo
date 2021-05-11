import ShowChartIcon from '@material-ui/icons/ShowChart';
import { Dashboard } from '@pbl-demo/components';
import { EmbedHighlight, EmbedMethodHighlight } from '@pbl-demo/components/Accessories';
import { handleThemeChange } from '@pbl-demo/components/Dashboard/helpers'
import { SwitchTheme } from '@pbl-demo/components/Filters';


const themeFilter = {
  "label": "Show or hide custom filters",
  "method": handleThemeChange,
  "methodName": "handleFiltersThemeChange",
  "component": SwitchTheme,
  "highlightComponent": EmbedHighlight,
  "gridWidth": 12,
  "options": { false: "Native filters", true: "Custom filters" },
  "alwaysShow": true
}

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
      "theme": "atom_light_arial_filters",
      "adjacentContainer": {
        "gridWidth": 2,
        "items": [themeFilter],
        "label": "Demographics",
        "collapsable": true
      },
      "themeable": true,
      "allowNativeFilters": true,
    }
  ],
  "requiredPermissionLevel": 0
}