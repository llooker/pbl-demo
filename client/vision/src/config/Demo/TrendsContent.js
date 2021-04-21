import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import { Dashboard } from '@pbl-demo/components';
import { SwitchTheme, RangeSlider } from '@pbl-demo/components/Filters';
import { EmbedHighlight, EmbedMethodHighlight } from '@pbl-demo/components/Accessories';
import { handleThemeChange } from '@pbl-demo/components/Dashboard/helpers'

const themeFilter = {
  "label": "Show or hide native filters",
  "method": handleThemeChange,
  "methodName": "handleNativeFilterThemeChange",
  "component": SwitchTheme,
  "highlightComponent": EmbedHighlight,
  "gridWidth": 12,
  "options": { true: "Native filters", false: "Custom filters" },
  "alwaysShow": true
}

const fipsFilter = {
  "label": "Select Fips Score",
  "filterName": "Fips Score",
  "lookerMethod": "runInlineQuery",
  "inlineQuery": {
    "model": "vision",
    "view": "application",
    "fields": [
      "case.fips_score",
      "case.count"
    ],
    "filters": {
      "case.fips_score": "NOT NULL"
    },
    "sorts": [
      "case.fips_score"
    ],
    "limit": "500",
  },
  "desiredFilterNames": "users.age",
  "resultFormat": "json",
  "component": RangeSlider,
  "apiKey": "rangeslider",
  "highlightComponent": EmbedHighlight,
  "showOnlyWhenFiltersHidden": true
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
        "gridWidth": 2,
        "items": [themeFilter, fipsFilter],
        "label": "Customize",
        // "requiresSelection": true,
        // "requiresSelectionMessage": "Click a case ID to see more details and notes for this case",
        // "displayHiddenFilterValue": true
      },
      "themeable": true
    }],
  "requiredPermissionLevel": 0
}