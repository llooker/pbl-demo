import FlagIcon from '@material-ui/icons/Flag';
import { Dashboard } from '@pbl-demo/components';
import { ModalButton, Dropdown, HiddenFilterValueText } from '@pbl-demo/components/Filters';
import { addCaseNotes, changeCaseStatus } from '@pbl-demo/components/Dashboard/helpers'
import { CloudFunctionHighlight, ApiHighlight } from '@pbl-demo/components/Accessories';

const addCaseNotesModal = {
  "copy": {
    "title": "Add Note",
    "defaultValue": "Default value",
    "suggestion": "Record a flag",
    "button": "Submit"
  },
  "method": addCaseNotes,
  "methodName": "addCaseNotes",
}

const addCaseNotesButton = {
  "label": "Add Case Notes",
  "component": ModalButton,
  "secondaryComponent": addCaseNotesModal,
  "tooltip": "Select a case",
  "gridWidth": 12,
  "highlightComponent": CloudFunctionHighlight
}


const changeCaseStatusSelect = {
  "label": "Case status",
  "component": Dropdown,
  "options": [
    { label: "Closed", value: "closed" },
    { label: "Open", value: "pending" },
  ],
  "method": changeCaseStatus,
  "methodName": "changeCaseStatus",
  "secondaryComponent": {
    "component": "button",
    "label": "Submit"
  },
  "tooltip": "Select a case",
  "gridWidth": 12,
  "highlightComponent": CloudFunctionHighlight
}

const caseId = {
  "label": "ID",
  "gridWidth": 12,
  "component": HiddenFilterValueText,
  "appendHiddenFilterToLabel": true,
  "highlightComponent": ApiHighlight,
  "requiresSelectionLabel": "Click a case ID to see more details and notes for this case",
}

export const FlagsConent = {
  "type": "dashboard",
  "label": "Flags",
  "menuCategory": "Home",
  "description": "Overview of all your web traffic",
  "icon": FlagIcon,
  "component": Dashboard,
  "lookerContent": [
    {
      "type": "dashboard",
      "lookerMethod": "embedDashboard",
      "id": "20",
      "slug": "219Tk9NQ4sGSjGNsRSFKjG",
      "label": "Flags",
      "isNext": false,
      "theme": "vision_theme",
      "adjacentContainer": {
        "gridWidth": 3,
        "collapsable": true,
        "items": [caseId, addCaseNotesButton, changeCaseStatusSelect],
        "label": "Case Details",
        "requiresSelection": true,
        "requiresSelectionMessage": "Click a case ID to see more details and notes for this case",
        "displayHiddenFilterValue": true
      }
    }],
  "requiredPermissionLevel": 1
}