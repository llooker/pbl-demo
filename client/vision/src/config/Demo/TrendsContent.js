import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import { Dashboard } from '@pbl-demo/components';
import { SwitchTheme, RangeSlider, CheckboxLabels, Dropdown, ToggleApi } from '@pbl-demo/components/Filters';
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
  "highlightComponent": EmbedMethodHighlight,
  "gridWidth": 12,
  "options": [{ "value": "M", "label": "Male" }, { "value": "F", "label": "Female" }],
  "showOnlyCustomFilters": true
}

const languageFilter = {
  "label": "Change language",
  "options": [{ label: "English", value: "english" }, { label: "Spanish", value: "spanish" }],
  "methodName": "handleLanguageChange",
  "tooltip": "Change language",
  "component": Dropdown,
  "highlightComponent": EmbedMethodHighlight,
  "gridWidth": 12,
  "filterName": "Language",
  "showOnlyCustomFilters": true,
}

const incomeFilter = {
  "label": "Previous Annual Income (thousands)",
  "filterName": "Previous Annual Income",
  "desiredFilterNames": "application.previous_annual_income",
  "component": RangeSlider,
  "highlightComponent": EmbedMethodHighlight,
  "showOnlyCustomFilters": true,
  "options": [
    { "application.previous_annual_income": 0 },
    { "application.previous_annual_income": 300 }
  ],
  "gridWidth": 12,
  "showMarks": true,
}

const ageTierFilter = {
  "label": "Age Tier",
  "filterName": "Age Bracket",
  "component": CheckboxLabels,
  "highlightComponent": EmbedMethodHighlight,
  "gridWidth": 12,
  "options": [
    { "value": "Below 10", "label": "Below 10" },
    { "value": "10 to 17", "label": "10 to 17" },
    { "value": "18 to 20", "label": "18 to 20" },
    { "value": "21 to 33", "label": "21 to 33" },
    { "value": "34 to 39", "label": "34 to 39" },
    { "value": "40 to 49", "label": "40 to 49" },
    { "value": "50 to 64", "label": "50 to 64" },
    { "value": "65 to 74", "label": "65 to 74" },
    { "value": "75 or Above", "label": "75 or Above" },
  ],
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
        "items": [themeFilter, genderCheckboxFilter, languageFilter, incomeFilter, ageTierFilter],
        "label": "Demographics",
        "collapsable": true
      },
      "themeable": true,
      "allowNativeFilters": true,
    }],
  "requiredPermissionLevel": 0
}