import FlagIcon from '@material-ui/icons/Flag';
import { Dashboard } from '@pbl-demo/components';
import { ModalButton } from '@pbl-demo/components/Filters';
import { addCaseNotes } from '@pbl-demo/components/Dashboard/helpers'

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
  "tooltip": "Select a case"
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
        "items": [addCaseNotesButton]
      }
    }],
  "requiredPermissionLevel": 1
}