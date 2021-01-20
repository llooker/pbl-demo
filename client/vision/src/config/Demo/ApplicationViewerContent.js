import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import samplePDF from './sample.pdf';
import { ApplicationViewer } from "@pbl-demo/components";

export const ApplicationViewerContent = {
  "type": "customfilter",
  "label": "PDF Viewer",
  "menuCategory": "Fraud and Improper Payments",
  "description": "Overview of all your web traffic",
  "icon": PictureAsPdfIcon,
  "component": ApplicationViewer,
  "lookerContent": [
    {
      "type": "pdfviewer",
      "id": "20",
      "label": "PDF Viewer",
      "isNext": false,
      "filters": [],
      "pdf": samplePDF
    }]
}

//valid usecase for exploring proptypes
//require type to be a string and then check that in pdfviewer component
//proptypes will help in testing