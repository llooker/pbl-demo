import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import { DocumentViewer } from "@pbl-demo/components";

const schema = {
  type: (value) => {
    return typeof value === "string";
  },
  label: (value) => {
    return typeof value === "string";
  }
}

export const DocumentViewerContent = {
  "type": "customfilter",
  "label": "Eligibility Docs",
  "menuCategory": "Home",
  "description": "Overview of all your web traffic",
  "icon": PictureAsPdfIcon,
  "component": DocumentViewer,
  "lookerContent": [
    {
      "type": "documentviewer",
      "id": "20",
      "label": "EligibilityDocs",
      "isNext": false,
      "filters": [],
      "url": "https://storage.cloud.google.com/gov_portal/1099_0_Bryan_Reynolds.pdf"
    }],
  "schema": schema,
  "requiredPermissionLevel": 1
}


