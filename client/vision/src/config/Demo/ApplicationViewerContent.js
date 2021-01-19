import ApplicationViewer from '../../components/Demo/ApplicationViewer/ApplicationViewer'
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';

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
      "filters": []
    }]
}

//valid usecase for exploring proptypes
//require type to be a string and then check that in pdfviewer component
//proptypes will help in testing