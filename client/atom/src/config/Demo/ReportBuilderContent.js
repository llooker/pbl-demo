import { ReportBuilder } from '@pbl-demo/components';
import LibraryBooksOutlinedIcon from '@material-ui/icons/LibraryBooksOutlined';
import { codeSandboxes } from '@pbl-demo/utils';
const { embedded_explore, embedded_look } = codeSandboxes

export const ReportBuilderContent = {
  "type": "report builder",
  "label": "Saved Reports",
  "menuCategory": "operations",
  "description": "Give users the ability to explore existing reports as well as create new ones all from within your application",
  "icon": LibraryBooksOutlinedIcon,
  "component": ReportBuilder,
  "lookerContent": [
    {
      "type": "folder",
      "id": "14",
      "label": "Saved Reports"
    },
    {
      "type": "explore",
      "id": "atom_fashion::order_items",
      "label": "Create New Report"
    }
  ],
  "requiredPermissionLevel": 1,
  "codeFlyoutContent": [
    embedded_look,
    embedded_explore
  ]
}