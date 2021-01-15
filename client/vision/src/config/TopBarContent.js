// export const TopBarContent = {
//   "lookerContent": [
//     {
//       "type": "dashboard",
//       "lookerMethod": "embedDashboard",
//       "id": "1",
//       "isNext": false,
//       "label": "Inventory Overview",
//       "filters": [
//         {
//           "label": "Select Application ID",
//           "filterName": "Application ID",
//           "lookerMethod": "runInlineQuery"
//         }
//       ],
//       "inlineQueries": [
//         {
//           "model": "vision",
//           "view": "person",
//           "fields": [
//             "person.application_id"
//           ],
//           "query_timezone": "America/Los_Angeles"
//         }
//       ],
//       "desiredFilterNames": [
//         "person.application_id"
//       ],
//       "filterComponents": [
//         "autocomplete"
//       ]
//     }
//   ]
// }

export const TopBarContent = {
  "autocomplete": [{
    "id": 1,
    "filters": [{
      "label": "Select Application ID",
      "filterName": "Application ID",
      "lookerMethod": "runInlineQuery"

    }],
    "inlineQuery": {
      "model": "vision",
      "view": "person",
      "fields": [
        "person.application_id"
      ],
      "query_timezone": "America/Los_Angeles"
    },
    "resultFormat": "json"
  }]
}