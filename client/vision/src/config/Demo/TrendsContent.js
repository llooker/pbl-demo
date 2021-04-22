import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import { Dashboard } from '@pbl-demo/components';
import { SwitchTheme, RangeSlider, CheckboxLabels } from '@pbl-demo/components/Filters';
import { EmbedHighlight, EmbedMethodHighlight } from '@pbl-demo/components/Accessories';
import { handleThemeChange } from '@pbl-demo/components/Dashboard/helpers'

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

const genderCheckboxFilter = {

  "label": "Select Gender",
  "filterName": "Gender",
  "method": handleThemeChange,
  "methodName": "handleFiltersThemeChange",
  "component": CheckboxLabels,
  "highlightComponent": EmbedHighlight,
  "gridWidth": 12,
  "options": ["male", "female"],
  "showOnlyCustomFilters": true
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
  "showOnlyCustomFilters": true
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
        "items": [themeFilter, genderCheckboxFilter, fipsFilter],
        "label": "Customize",
      },
      "themeable": true,
      "allowNativeFilters": true
    }],
  "requiredPermissionLevel": 0
}