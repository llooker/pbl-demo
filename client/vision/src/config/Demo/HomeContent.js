import HomeIcon from '@material-ui/icons/Home';
import { Dashboard } from '@pbl-demo/components';


const countyTrends = {
  "inlineQuery": {
    "model": "vision",
    "view": "application",
    "fields": [
      "person.home_city",
      "case.opened_week",
      "case.count"
    ],
    "pivots": [
      "case.opened_week"
    ],
    "fill_fields": [
      "case.opened_week"
    ],
    "filters": {
      "case.opened_week": "2 weeks ago for 2 weeks"
    },
    "sorts": [
      "case.opened_week"
    ],
    "limit": "500",
    "dynamic_fields": "[{\"table_calculation\":\"change\",\"label\":\"% Change\",\"expression\":\"(pivot_index(${case.count}, 2) - pivot_index(${case.count}, 1)) / pivot_index(${case.count}, 1)\",\"value_format\":null,\"value_format_name\":\"percent_2\",\"_kind_hint\":\"supermeasure\",\"_type_hint\":\"number\"}]",
  },
  "resultFormat": "json",
  "label": "Country trends",
  "component": "trends",
  "fieldsOfInterest": [
    "person.home_city",
    "change"
  ]
}

export const HomeContent = {
  "type": "dashboard",
  "label": "Home",
  "menuCategory": "Home",
  "description": "Overview of all your web traffic",
  "icon": HomeIcon,
  "component": Dashboard,
  "lookerContent": [
    {
      "type": "dashboard",
      "lookerMethod": "embedDashboard",
      "id": "18",
      "slug": "L9H7zcEn0tgq3z35tA0jUb",
      "label": "Trends",
      "isNext": false,
      "theme": "vision_theme",
      "trends": [countyTrends]
    }],
  "requiredPermissionLevel": 0
}