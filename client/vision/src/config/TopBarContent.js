export const TopBarContent = {
  "autocomplete": {
    "filterName": "Household ID",
    "lookerMethod": "runInlineQuery",
    "inlineQuery": {
      "model": "vision",
      "view": "person",
      "fields": [
        "person.household_id",
        "person.first_name",
        "person.last_name",
      ],
      "query_timezone": "America/Los_Angeles"
    },
    "resultFormat": "json",
  }
}