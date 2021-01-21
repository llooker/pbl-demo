import Dashboard from '../../components/Demo/Dashboard/Dashboard'
import PeopleIcon from '@material-ui/icons/People';

const householdIdFilter = {
  "label": "Select Household ID",
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
    "query_timezone": "America/Los_Angeles",
  },
  "desiredFilterNames": "person.household_id",
  "component": "autocomplete",
  "resultFormat": "json"
}

export const HouseholdsContent = {
  "type": "dashboard",
  "label": "Households",
  "menuCategory": "Home",
  "description": "Overview of all your web traffic",
  "icon": PeopleIcon,
  "component": Dashboard,
  "lookerContent": [
    {
      "type": "dashboard",
      "lookerMethod": "embedDashboard",
      "id": "21",
      "label": "Households",
      "isNext": false,
      // "filters": [householdIdFilter],
      // "theme": "atom_fashion_filters",
      "filterName": "Household ID"
    }]
}