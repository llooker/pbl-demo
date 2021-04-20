import PeopleIcon from '@material-ui/icons/People';
import { Dashboard } from '@pbl-demo/components'
import { Dropdown, HiddenFilterValueText, SwitchTheme } from '@pbl-demo/components/Filters';
import { createCase } from '@pbl-demo/components/Dashboard/helpers'
import { CloudFunctionHighlight, ApiHighlight, EmbedHighlight } from '@pbl-demo/components/Accessories';
import { handleThemeChange } from '@pbl-demo/components/Dashboard/helpers'

const createCaseSelect = {
  "label": "Case type",
  "component": Dropdown,
  "options": [
    { label: "Suspicious Email", value: "human_suspicious_email" },
    { label: "Document Mismatch", value: "human_document_mismatch" },
    { label: "Login Behavior", value: "human_login_behavior" },
    { label: "Duplicate Enrollments", value: "duplicate_enrollments" },
    { label: "Multiple Head of Household one Address", value: "human_multiple_head_of_household" },
    { label: "Facts Changing in Multiple Applications", value: "human_eligibility_fact_change" }
  ],
  "method": createCase,
  "methodName": "createCase",
  "secondaryComponent": {
    "component": "button",
    "label": "Create case"
  },
  "tooltip": "Create a case",
  "highlightComponent": CloudFunctionHighlight,
  "gridWidth": 12,
}

const caseId = {
  "label": "ID",
  "gridWidth": 12,
  "component": HiddenFilterValueText,
  "appendHiddenFilterToLabel": true,
  "highlightComponent": ApiHighlight,
  "requiresSelectionLabel": "Click a case ID to see more details and notes for this case",
}

const themeSwitch = {
  "label": "Light or dark theme",
  "method": handleThemeChange,
  "methodName": "handlelightDarkThemeChange",
  "component": SwitchTheme,
  "highlightComponent": EmbedHighlight,
  "gridWidth": 12,
  "options": { true: "Light mode", false: "Dark mode" },
}

const themeFontFilter = {
  "label": "Change font",
  "options": [{ label: "Arial", value: "arial" },
  { label: "Roboto", value: "roboto" },
  { label: "Vollkorn", value: "vollkorn" }],
  "method": handleThemeChange,
  "methodName": "handleFontThemeChange",
  "tooltip": "",
  "component": Dropdown,
  "highlightComponent": EmbedHighlight,
  "gridWidth": 12,
}
export const BeneficiaryContent = {
  "type": "dashboard",
  "label": "Beneficiary",
  "menuCategory": "Home",
  "description": "Overview of all your web traffic",
  "icon": PeopleIcon,
  "component": Dashboard,
  "lookerContent": [
    {
      "type": "dashboard",
      "lookerMethod": "embedDashboard",
      "id": "21",
      "slug": "9AWvUrPlXWy6djYAdOOKge",
      "label": "Beneficiary",
      "isNext": false,
      "filterName": "Person ID",
      "theme": "vision_light_arial",
      "adjacentContainer": {
        "gridWidth": 2,
        "items": [caseId, createCaseSelect, themeSwitch, themeFontFilter],
        "collapsable": true,
        "label": "Application",
        "displayHiddenFilterValue": true
      },
      "themeable": true
    }],
  "requiredPermissionLevel": 1
}