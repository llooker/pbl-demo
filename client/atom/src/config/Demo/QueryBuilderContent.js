// import QueryBuilder from '../../components/Demo/QueryBuilder/QueryBuilder'
import SearchIcon from '@material-ui/icons/Search';
import { codeSandboxes } from '@pbl-demo/utils';
import { EmbeddedExtension } from '@pbl-demo/components';

const { api_run_query } = codeSandboxes;

export const QueryBuilderContent = {
  "type": "query builder",
  "label": "Query Builder",
  "menuCategory": "operations",
  "description": "Enable business users to self serve on data and answer their own questions",
  "icon": SearchIcon,
  "component": EmbeddedExtension,
  "lookerContent": [
    {
      "type": "extension",
      "id": "query-builder-ef::query-builder",
      "label": "Query Builder EF"
    },
  ],
  "requiredPermissionLevel": 0,
  "codeFlyoutContent": [
    api_run_query
  ]
}