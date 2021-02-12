import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import { PDFViewer } from "@pbl-demo/components";

const schema = {
  type: (value) => {
    return typeof value === "string";
  },
  label: (value) => {
    return typeof value === "string";
  }
}

export const PDFViewerContent = {
  "type": "customfilter",
  "label": "EligibilityDocs",
  "menuCategory": "Home",
  "description": "Overview of all your web traffic",
  "icon": PictureAsPdfIcon,
  "component": PDFViewer,
  "lookerContent": [
    {
      "type": "pdfviewer",
      "id": "20",
      "label": "EligibilityDocs",
      "isNext": false,
      "filters": [],
      "pdf": "https://storage.googleapis.com/looker-dat-vision/1099.pdf"
    }],
  "schema": schema,
  "requiredPermissionLevel": 1
}


