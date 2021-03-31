import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import { Dashboard } from '@pbl-demo/components'
import { Dropdown } from '@pbl-demo/components/Filters'
import { createCase } from '@pbl-demo/components/Dashboard/helpers'
import { CloudFunctionHighlight } from '@pbl-demo/components/Accessories';

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
}


export const ApplicationContent = {
  "type": "dashboard",
  "label": "Application",
  "menuCategory": "Home",
  "description": "Overview of all your web traffic",
  "icon": AssignmentIndIcon,
  "component": Dashboard,
  "lookerContent": [
    {
      "type": "dashboard",
      "lookerMethod": "embedDashboard",
      "id": "22",
      "slug": "xuRJEILMoKTPwjhqNvnBbD",
      "label": "Application",
      "isNext": false,
      "theme": "vision_theme",
      "adjacentContainer": {
        "gridWidth": 2,
        "items": [createCaseSelect],
        "collapsable": true
      }
    }],
  "requiredPermissionLevel": 0
}