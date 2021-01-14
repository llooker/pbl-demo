import SplashPage from '../../components/Demo/SplashPage/SplashPage';
import HomeIcon from '@material-ui/icons/Home'; //already declared


export const SplashPageContent = {
  "type": "splashpage",
  "label": "Home",
  "description": "We're thrilled to have you on Atom Fashion - the premiere third party fashion marketplace for today's leading brands. Throughout this portal you will find a series of analytic content designed to help you maximize your performance.",
  "menuCategory": "home",
  "icon": HomeIcon,
  "component": SplashPage,
  "lookerContent": [
    {
      "id": "19",
      "gridWidth": 6,
      "height": 160,
      "type": "welcome",
      "inlineQueries": [
        {
          "model": "atom_fashion",
          "view": "order_items",
          "fields": [
            "order_items.total_sale_price",
            "order_items.created_week",
            "products.category"
          ],
          "pivots": [
            "order_items.created_week"
          ],
          "fill_fields": [
            "order_items.created_week"
          ],
          "filters": {
            "order_items.created_date": "2 weeks ago for 2 weeks"
          },
          "filter_expression": null,
          "sorts": [
            "order_items.total_sale_price desc 1",
            "order_items.created_week 0"
          ],
          "limit": "1",
          "dynamic_fields": "[{\"table_calculation\":\"change\",\"label\":\"%25 Change\",\"expression\":\"(pivot_index(${order_items.total_sale_price},2)-pivot_index(${order_items.total_sale_price},1))/pivot_index(${order_items.total_sale_price},1\\n  )\",\"value_format\":null,\"value_format_name\":\"percent_2\",\"_kind_hint\":\"supermeasure\",\"_type_hint\":\"number\"}]"
        },
        {
          "model": "atom_fashion",
          "view": "order_items",
          "fields": [
            "order_items.total_sale_price",
            "order_items.created_week",
            "products.category"
          ],
          "pivots": [
            "order_items.created_week"
          ],
          "fill_fields": [
            "order_items.created_week"
          ],
          "filters": {
            "order_items.created_date": "2 weeks ago for 2 weeks"
          },
          "filter_expression": null,
          "sorts": [
            "order_items.total_sale_price 1",
            "order_items.created_week 0"
          ],
          "limit": "1",
          "dynamic_fields": "[{\"table_calculation\":\"change\",\"label\":\"%25 Change\",\"expression\":\"(pivot_index(${order_items.total_sale_price},2)-pivot_index(${order_items.total_sale_price},1))/pivot_index(${order_items.total_sale_price},1\\n  )\",\"value_format\":null,\"value_format_name\":\"percent_2\",\"_kind_hint\":\"supermeasure\",\"_type_hint\":\"number\"}]"
        }
      ],
      "inlineQueriesMap": [
        "best",
        "worst"
      ],
      "resultFormat": "json"
    },
    {
      "id": "17",
      "gridWidth": 6,
      "height": 160,
      "type": "carousel"
    },
    {
      "id": "18",
      "gridWidth": 3,
      "type": "single value",
      "height": 120,
      "inlineQuery": {
        "model": "atom_fashion",
        "view": "order_items",
        "fields": [
          "order_items.created_week",
          "order_items.total_gross_margin"
        ],
        "fill_fields": [
          "order_items.created_week"
        ],
        "filters": {
          "order_items.created_date": "12 weeks ago for 12 weeks"
        },
        "sorts": [
          "order_items.created_week desc"
        ],
        "limit": "500",
        "dynamic_fields": "[{\"table_calculation\":\"change\",\"label\":\"Week over Week %25 Change\",\"expression\":\"(${order_items.total_gross_margin}-offset(${order_items.total_gross_margin},1))/offset(${order_items.total_gross_margin},1)\",\"value_format\":null,\"value_format_name\":\"percent_2\",\"_kind_hint\":\"measure\",\"_type_hint\":\"number\"}]"
      },
      "resultFormat": "json",
      "label": "Revenue by Week",
      "visColor": "#4595EC",
      "chipFormat": "revenue"
    },
    {
      "id": "20",
      "gridWidth": 3,
      "type": "single value",
      "height": 120,
      "inlineQuery": {
        "model": "atom_fashion",
        "view": "web_events",
        "fields": [
          "events.event_week",
          "events.sessions_count"
        ],
        "fill_fields": [
          "events.event_week"
        ],
        "filters": {
          "events.event_date": "12 weeks ago for 12 weeks"
        },
        "sorts": [
          "events.event_week desc"
        ],
        "limit": "500",
        "dynamic_fields": "[{\"table_calculation\":\"change\",\"label\":\"%25 Change\",\"expression\":\"(${events.sessions_count}-offset(${events.sessions_count},1))/offset(${events.sessions_count},1)\",\"value_format\":null,\"value_format_name\":\"percent_2\",\"_kind_hint\":\"measure\",\"_type_hint\":\"number\"}]"
      },
      "resultFormat": "json",
      "label": "Visits by Week",
      "visColor": "#F3A759",
      "chipFormat": "integer"
    },
    {
      "id": "21",
      "gridWidth": 3,
      "type": "single value",
      "height": 120,
      "inlineQuery": {
        "model": "atom_fashion",
        "view": "web_events",
        "fields": [
          "events.event_week",
          "events.bounce_rate"
        ],
        "fill_fields": [
          "events.event_week"
        ],
        "filters": {
          "events.event_date": "12 weeks ago for 12 weeks"
        },
        "filter_expression": null,
        "sorts": [
          "events.event_week desc"
        ],
        "limit": "500",
        "dynamic_fields": "[{\"table_calculation\":\"change\",\"label\":\"%25 Change\",\"expression\":\"(${events.bounce_rate}-offset(${events.bounce_rate},1))/offset(${events.bounce_rate},1)\",\"value_format\":null,\"value_format_name\":\"percent_2\",\"_kind_hint\":\"measure\",\"_type_hint\":\"number\"}]"
      },
      "resultFormat": "json",
      "label": "Bounce Rate by Week",
      "visColor": "#E24E3A",
      "chipFormat": "percent"
    },
    {
      "id": "22",
      "gridWidth": 3,
      "type": "single value",
      "height": 120,
      "inlineQuery": {
        "model": "atom_fashion",
        "view": "web_events",
        "fields": [
          "events.event_week",
          "sessions.average_duration"
        ],
        "pivots": null,
        "fill_fields": [
          "events.event_week"
        ],
        "filters": {
          "events.event_date": "12 weeks ago for 12 weeks"
        },
        "filter_expression": null,
        "sorts": [
          "events.event_week desc"
        ],
        "limit": "500",
        "dynamic_fields": "[{\"table_calculation\":\"change\",\"label\":\"%25 Change\",\"expression\":\"(${sessions.average_duration}-offset(${sessions.average_duration},1))/offset(${sessions.average_duration},1)\",\"value_format\":null,\"value_format_name\":\"percent_2\",\"_kind_hint\":\"measure\",\"_type_hint\":\"number\"}]"
      },
      "resultFormat": "json",
      "label": "Average Time on Site by Week",
      "visColor": "#65AB5A",
      "chipFormat": "integer"
    },
    {
      "gridWidth": 8,
      "height": 350,
      "type": "dashboard",
      "id": "12",
      "slug": "3ytMWYFKKbofCDFkpAG46z",
      "title": "Most Recent Orders"
    },
    {
      "gridWidth": 4,
      "height": 350,
      "type": "popular analysis",
      "vectors": [
        {
          "id": "9",
          "type": "thumbnail",
          "resourceType": "dashboard",
          "lookerMethod": "vector_thumbnail",
          "label": "Analytics",
          "gridWidth": "4",
          "url": "webanalytics"
        },
        {
          "id": "5",
          "type": "thumbnail",
          "resourceType": "dashboard",
          "lookerMethod": "vector_thumbnail",
          "label": "Sales",
          "gridWidth": "4",
          "url": "inventoryoverview"
        },
        {
          "id": "1",
          "type": "thumbnail",
          "resourceType": "dashboard",
          "lookerMethod": "vector_thumbnail",
          "label": "Inventory",
          "gridWidth": "4",
          "url": "salesoverview"
        }
      ],
      "label": "Popular analysis"
    }
  ]
}