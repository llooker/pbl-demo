
import { permissionLevels, rowLevelAttribute } from "./UserPermissionsContent";
import { HouseholdsContent } from './Demo/HouseholdsContent'
const logo = require('../images/logo.svg').default

export const TopBarContent = {
  "autocomplete": {
    "filterName": "Person ID", //needs to match filter name in corresponding component file
    "lookerMethod": "runInlineQuery",
    "inlineQuery": {
      "model": "vision",
      "view": "application",
      "fields": [
        "person._search",
        "person.person_id",
      ],
      "filters": {
        "person.person_id": "not null"
      },
      "query_timezone": "America/Los_Angeles",
      "limit": 50
    },
    "resultFormat": "json",
    "formattedLabel": [
      "person._search"],
    "value": [
      "person.person_id"],
    "correspondingComponentContent": HouseholdsContent,
    "alternateName": "Search",
    "apiDrivenSearch": true
  },
  "usermenu": { permissionLevels, rowLevelAttribute },
  "label": "Benefits Investigator", //<br/>
  "avatar": logo,
  "avatarStyle": {
    "height": "40px",
    "fill": "white"
  }
}