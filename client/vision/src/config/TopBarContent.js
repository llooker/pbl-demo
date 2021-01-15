export const TopBarContent = {
  "autocomplete": {
    "filterName": "Application ID",
    "lookerMethod": "runInlineQuery",
    "inlineQuery": {
      "model": "vision",
      "view": "person",
      "fields": [
        "person.application_id"
      ],
      "query_timezone": "America/Los_Angeles"
    },
    "resultFormat": "json",
  }
}