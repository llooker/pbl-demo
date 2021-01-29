
import { permissionLevels, rowLevelAttribute } from "./UserPermissionsContent";
import { HouseholdsContent } from './Demo/HouseholdsContent'

export const TopBarContent = {
  "autocomplete": {
    "filterName": "Household ID",
    "lookerMethod": "runInlineQuery",
    "inlineQuery": {
      "model": "vision",
      "view": "application",
      "fields": [
        "_person.household_id",
        "_person.first_name",
        "_person.last_name",
      ],
      "filters": {
        "_person.household_id": "not null"
      },
      "query_timezone": "America/Los_Angeles"
    },
    "resultFormat": "json",
    "formattedLabel": [
      "_person.first_name",
      "_person.last_name",
      "_person.household_id"],
    "value": [
      "_person.household_id"],
    "correspondingComponentContent": HouseholdsContent,
    "alternateName": "Search"
  },
  "usermenu": { permissionLevels, rowLevelAttribute },
  "label": "Benefits Investigator"
}