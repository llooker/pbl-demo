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
  "label": "PDF Viewer",
  "menuCategory": "Home",
  "description": "Overview of all your web traffic",
  "icon": PictureAsPdfIcon,
  "component": PDFViewer,
  "lookerContent": [
    {
      "type": "pdfviewer",
      "id": "20",
      "label": "PDF Viewer",
      "isNext": false,
      "filters": [],
      "pdf": "https://storage.googleapis.com/looker-dat-vision/1099.pdf"
    }],
  "schema": schema,
  "requiredPermissionLevel": 1
}


