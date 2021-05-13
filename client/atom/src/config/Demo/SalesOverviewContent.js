import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import { Dashboard } from '@pbl-demo/components';
import { AutoComplete, MapFilter, RangeSlider, ToggleApi, ToggleButton } from '@pbl-demo/components/Filters';
import { CloudFunctionHighlight, ApiHighlight, EmbedHighlight, EmbedMethodHighlight } from '@pbl-demo/components/Accessories';
import { SentimentDissatisfied, SentimentSatisfied, SentimentVerySatisfied } from '@material-ui/icons';
import Usa from "@svg-maps/usa";

const productCategoryFilter = {
  "label": "Select Product Category",
  "filterName": "Category",
  "lookerMethod": "runInlineQuery",
  "inlineQuery": {
    "model": "atom_fashion",
    "view": "order_items",
    "fields": [
      "this_period",
      "last_period",
      "products.category"
    ],
    "filters": {
      "order_items.created_date": "60 days ago for 60 days",
      "order_items.count": ">5"
    },
    "sorts": [
      "products.category"
    ],
    "limit": 500,
    "dynamic_fields": "[{\"table_calculation\":\"trend\",\"label\":\"trend\",\"expression\":\"${this_period} / ${last_period} - 1\",\"value_format\":null,\"value_format_name\":null,\"_kind_hint\":\"measure\",\"_type_hint\":\"number\"},{\"measure\":\"this_period\",\"based_on\":\"order_items.total_sale_price\",\"type\":\"count_distinct\",\"label\":\"This Period\",\"value_format\":null,\"value_format_name\":null,\"_kind_hint\":\"measure\",\"_type_hint\":\"number\",\"filter_expression\":\"matches_filter(${order_items.created_date},`30 days ago for 30 days`)\"},{\"measure\":\"last_period\",\"based_on\":\"order_items.total_gross_margin\",\"label\":\"Last Period\",\"value_format\":null,\"value_format_name\":null,\"_kind_hint\":\"measure\",\"_type_hint\":\"number\",\"filter_expression\":\"matches_filter(${order_items.created_date},`60 days ago for 30 days`)\"}]",
    "theme": "atom_fashion"
  },
  "desiredFilterNames": "products.brand",
  "resultFormat": "json",
  "component": AutoComplete,
  "apiKey": "autocomplete",
  "highlightComponent": ApiHighlight
}

const customUsa = {
  ...Usa,
  label: "Custom map label",
  locations: Usa.locations.map(location => {
    // Modify each location
    switch (location.name) {
      //9
      case "Connecticut":
      case "Maine":
      case "Massachusetts":
      case "New Hampshire":
      case "Rhode Island":
      case "Vermont":
      case "New Jersey":
      case "New York":
      case "Pennsylvania":
      case "Delaware":
        return { ...location, region: "Northeast" }
      //12
      case "Illinois":
      case "Indiana":
      case "Michigan":
      case "Ohio":
      case "Wisconsin":
      case "Iowa":
      case "Kansas":
      case "Minnesota":
      case "Missouri":
      case "Nebraska":
      case "North Dakota":
      case "South Dakota":
        return { ...location, region: "Midwest" }
      //16
      case "Florida":
      case "Georgia":
      case "Maryland":
      case "North Carolina":
      case "South Carolina":
      case "Virginia":
      case "District of Columbia":
      case "Washington, DC":
      case "West Virginia":
      case "Alabama":
      case "Kentucky":
      case "Mississippi":
      case "Tennessee":
      case "Arkansas":
      case "Louisiana":
      case "Oklahoma":
      case "Texas":
        return { ...location, region: "South" }
      //8
      case "Arizona":
      case "Colorado":
      case "Idaho":
      case "Montana":
      case "Nevada":
      case "New Mexico":
      case "Utah":
      case "Wyoming":
        return { ...location, region: "Mountain" }
      //5
      case "Alaska":
      case "California":
      case "Hawaii":
      case "Oregon":
      case "Washington":
        return { ...location, region: "Pacific" }
      // default:
      //   return location
    }
  })
}

const regionFilter = {
  "label": "Select Region",
  "filterName": "State Region",
  "lookerMethod": "runInlineQuery",
  "inlineQuery":
  {
    "model": "atom_fashion",
    "view": "order_items",
    "fields": [
      "users.state_region"
    ],
    "limit": "500"
  },
  "desiredFilterNames": "users.state_region",
  "resultFormat": "json",
  "component": MapFilter,
  "apiKey": "mapfilter",
  "highlightComponent": EmbedMethodHighlight,
  "map": customUsa
}

const ageFilter = {
  "label": "Select Age Range",
  "filterName": "Age",
  "lookerMethod": "runInlineQuery",
  "inlineQuery": {
    "model": "atom_fashion",
    "view": "order_items",
    "fields": [
      "users.age"
    ],
    "limit": "500"
  },
  "desiredFilterNames": "users.age",
  "resultFormat": "json",
  "component": RangeSlider,
  "apiKey": "rangeslider",
  "highlightComponent": EmbedMethodHighlight
}

// going to need this for atom refactor
const lifetimeRevenueTierMap = {
  "0 to 99": <>Low <SentimentDissatisfied /></>,
  "100 to 499": <>Medium <SentimentSatisfied /></>,
  "500 or Above": <>High <SentimentVerySatisfied /></>,
}
//this should be static & not require api call
const revenueTierFilter = {
  "label": "Lifetime Revenue Tier",
  "filterName": "Lifetime Revenue Tier",
  "lookerMethod": "runInlineQuery",
  "inlineQuery": {
    "model": "atom_fashion",
    "view": "order_items",
    "fields": [
      "user_order_facts.lifetime_revenue_tier"
    ],
    "limit": "500"
  },
  "desiredFilterNames": "users.lifetime_revenue_tier",
  "component": "togglebuttonapi",
  "resultFormat": "json",
  "component": ToggleApi,
  "apiKey": "togglebuttonapi",
  "highlightComponent": EmbedMethodHighlight,
  "options": lifetimeRevenueTierMap,
}

export const SalesOverviewContent = {
  "type": "custom filter",
  "label": "Sales Overview",
  "menuCategory": "sales",
  "description": "Overview of all your sales!",
  "icon": VisibilityOutlinedIcon,
  "component": Dashboard,
  "lookerContent": [
    {
      "type": "dashboard",
      "lookerMethod": "embedDashboard",
      "id": "5",
      "label": "Sales Overview",
      "isNext": true,
      "adjacentContainer": {
        "gridWidth": 4,
        "items": [productCategoryFilter, regionFilter, ageFilter,
          revenueTierFilter
        ],
        "collapsable": true
      }
    }],
  "requiredPermissionLevel": 0
}