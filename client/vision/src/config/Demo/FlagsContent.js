import FlagIcon from '@material-ui/icons/Flag';
import { Dashboard } from '@pbl-demo/components';
import { ModalButton, Dropdown } from '@pbl-demo/components/Filters';
import { addCaseNotes, changeCaseStatus } from '@pbl-demo/components/Dashboard/helpers'

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
  "gridWidth": 2
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
  "gridWidth": 2
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
        "gridWidth": 12,
        "items": [addCaseNotesButton, changeCaseStatusSelect]
      }
    }],
  "requiredPermissionLevel": 1
}