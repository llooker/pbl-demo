import HomeIcon from '@material-ui/icons/Home';
import { ApiHighlight } from '@pbl-demo/components/Accessories';
import { Dashboard, TrendItem, InlineList } from '@pbl-demo/components';
import { runInlineQuery } from '@pbl-demo/components/Dashboard/helpers';


const countyTrends = {
  "inlineQuery": {
    "model": "vision",
    "view": "account_events",
    "fields": [
      "account_events.count",
      "person.home_city",
      "account_events.datetime_quarter"
    ],
    "pivots": [
      "person.home_city"
    ],
    "fill_fields": [
      "account_events.datetime_quarter"
    ],
    "filters": {
      "account_events.type": "\"submit_application\"",
      "person.home_city": "San Francisco,San Jose,Los Angeles,Sacramento,Bakersfield,Riverside,Santa Cruz,Fresno,Oakland,Fremont"

    },
    "sorts": [
      "person.home_city 0",
      "account_events.datetime_quarter"
    ],
    "dynamic_fields": "[{\"table_calculation\":\"pop\",\"label\":\"pop\",\"expression\":\"(${account_events.count} - offset(${account_events.count},1))/offset(${account_events.count},1)\",\"value_format\":null,\"value_format_name\":\"percent_1\",\"_kind_hint\":\"measure\",\"_type_hint\":\"number\"}]",
    "limit": "500"
  },
  "drillInlineQuery": {
    "model": "vision",
    "view": "account_events",
    "fields": [
      "account_events.count",
      "person.home_city",
      "person.name",
      "person.mailing_address",
    ],
    "sorts": [
      "person.home_city 0",
      "account_events.datetime_quarter"
    ],
    "filters": {
      "account_events.type": "\"submit_application\"",
      "person.home_city": "San Francisco,San Jose,Los Angeles,Sacramento,Bakersfield,Riverside"
    },
    "limit": "500"
  },
  "resultFormat": "json",
  "label": "Country trends",
  "component": TrendItem,
  "fieldsOfInterest": [
    "pop",
    "person.home_city"
  ],
  "apiKey": "trends",
  "highlightComponent": ApiHighlight,
  "gridWidth": 1,
  "method": runInlineQuery,
  "methodName": "runInlineQuery",
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
      "theme": "vision_light_arial",
      // "adjacentContainer": {
      //   "gridWidth": 12,
      //   "items": [countyTrends],
      //   "component": InlineList
      // }
    }],
  "requiredPermissionLevel": 0,
  "codeFlyoutContent": [
    {
      link: "https://codesandbox.io/embed/embedded-dashboard-iilew?fontsize=14&hidenavigation=1&theme=light&view=editor",
      label: "Sample Embedded Dashboard"
    }
  ]
}