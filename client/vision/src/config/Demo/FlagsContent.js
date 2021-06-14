import FlagIcon from '@material-ui/icons/Flag';
import { Dashboard } from '@pbl-demo/components';
import { ModalButton, Dropdown, HiddenFilterValueText, NotesList, LinkText } from '@pbl-demo/components/Filters';
import { addCaseNotes, changeCaseStatus } from '@pbl-demo/components/Dashboard/helpers'
import { CloudFunctionHighlight, ApiHighlight } from '@pbl-demo/components/Accessories';

const addCaseNotesModal = {
  "copy": {
    "title": "Add Note",
    "suggestion": "Log an update",
    "button": "Submit"
  },
  "method": addCaseNotes,
  "methodName": "addCaseNotes",
}

const addCaseNotesButton = {
  "label": "New Note",
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
    { label: "Open", value: "pending" },
    { label: "Closed", value: "closed" },
  ],
  "method": changeCaseStatus,
  "methodName": "changeCaseStatus",
  "secondaryComponent": {
    "component": "button",
    "label": "Submit"
  },
  "tooltip": "Select a status",
  "gridWidth": 12,
  "highlightComponent": CloudFunctionHighlight
}

const caseId = {
  "label": "ID",
  "gridWidth": 3,
  "component": HiddenFilterValueText,
  "appendHiddenFilterToLabel": true,
  "highlightComponent": ApiHighlight,
  "requiresSelectionLabel": "Click a case ID to see more details and notes for this case",
}

// const viewApplicationLink = {
//   "label": "View Application",
//   "gridWidth": 9,
//   "component": LinkText,
//   "appendHiddenFilterToLabel": true,
//   "highlightComponent": ApiHighlight,
//   "requiresSelectionLabel": "Click a case ID to see more details and notes for this case",
//   "inlineQuery": {
//     "model": "vision",
//     "view": "application",
//     "fields": [
//       "case.case_id",
//       "application.application_id"
//     ],
//     "filters": {
//       "case.case_id": "7"
//     },
//     "limit": "500",
//   },
//   "apiKey": "viewapplication",
//   "staticHref": "/analytics/application?Application%20ID="
// }

const viewBeneficiaryLink = {
  "label": "View Beneficiary",
  "gridWidth": 9,
  "component": LinkText,
  "highlightComponent": ApiHighlight,
  "inlineQuery": {
    "model": "vision",
    "view": "application",
    "fields": [
      "case.case_id",
      "person.person_id"
    ],
    "filters": {
      "case.case_id": "7"
    },
    "limit": "500",
  },
  "apiKey": "viewbeneficiary",
  "staticHref": "/analytics/beneficiary?Person%20ID="
}

const caseNotesById = {
  "label": "Case Notes",
  "inlineQuery": {
    "model": "vision",
    "view": "application_no_cache", //application
    "fields": [
      "case_events.datetime_date",
      "case_events.notes"
    ],
    "filters": {
      "case.case_id": "71"
    },
    "sorts": [
      "case_events.datetime_date"
    ],
    "limit": "500"
  },
  "resultFormat": "json",
  "highlightComponent": ApiHighlight,
  "apiKey": "noteslist",
  "component": NotesList,
  "gridWidth": 12,
}

export const FlagsConent = {
  "type": "dashboard",
  "label": "Open Cases",
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
      "theme": "vision_light_arial",
      "adjacentContainer": {
        "gridWidth": 3,
        "collapsable": true,
        // "items": [caseId, viewBeneficiaryLink, changeCaseStatusSelect, caseNotesById, addCaseNotesButton],
        "items": [caseId, changeCaseStatusSelect, caseNotesById, addCaseNotesButton],
        "label": "Case Details",
        "requiresSelection": true,
        "requiresSelectionMessage": "Click a case ID to see more details and notes for this case",
        "displayHiddenFilterValue": true
      }
    }],
  "requiredPermissionLevel": 1,
  "codeSandboxEmbedLink": "https://codesandbox.io/embed/embedded-dashboard-iilew?fontsize=14&hidenavigation=1&theme=light"
}