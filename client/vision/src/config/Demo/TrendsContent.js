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
  "options": ["male", "female"],
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
  "showOnlyCustomFilters": true,
  "filterName": "Language"
}

const incomeFilter = {
  "label": "Previous Annual Income",
  "filterName": "Previous Annual Income",
  "desiredFilterNames": "application.previous_annual_income",
  "component": RangeSlider,
  "highlightComponent": EmbedHighlight,
  "showOnlyCustomFilters": true,
  "options": [{ "application.previous_annual_income": 0 }, { "application.previous_annual_income": 300000 }],
  "showMarks": true
}

const ageTierFilter = {
  "label": "Age Tier",
  "filterName": "Age Bracket",
  "lookerMethod": "runInlineQuery",
  "inlineQuery": {
    "model": "vision",
    "view": "application",
    "fields": [
      "person.age_bracket"
    ],
  },
  "desiredFilterNames": "person.age_bracket",
  "resultFormat": "json",
  "component": ToggleApi,
  "apiKey": "toggleapi",
  "highlightComponent": EmbedMethodHighlight,
  "exclusive": false
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
        "label": "Customize",
      },
      "themeable": true,
      "allowNativeFilters": true
    }],
  "requiredPermissionLevel": 0
}