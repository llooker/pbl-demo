import Dashboard from '../../components/Demo/Dashboard/Dashboard'
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';


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
  "component": "autocomplete",
  "resultFormat": "json"
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
  "component": "mapfilter",
  "resultFormat": "json"
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
  "component": "rangeslider",
  "resultFormat": "json"
}

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
  "resultFormat": "json"
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
      "filters": [productCategoryFilter, regionFilter, ageFilter, revenueTierFilter]
    }]
}