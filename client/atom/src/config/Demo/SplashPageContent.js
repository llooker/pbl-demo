import SplashPage from '../../components/Demo/SplashPage/SplashPage';
import HomeIcon from '@material-ui/icons/Home'; //already declared

const bestWorstAnalysis = {
  "id": "19",
  "gridWidth": 12,
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
}
const revenueByWeek =
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
}

const visitsByWeek =
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
}

const bounceRateByWeek =
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
}

const averageTimeByWeek =
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
}

const embeddedQuery =
{
  "gridWidth": 8,
  "height": 350,
  "type": "embeddedquery",
  "id": "12",
  "queryUrl": "embed/query/atom_fashion/order_items?fields=order_items.created_time,users.name,order_items.total_sale_price,users.approx_location,users.city&f[users.country]=USA&sorts=order_items.created_time+desc&limit=100&query_timezone=America%2FLos_Angeles&vis=%7B%22map_plot_mode%22%3A%22points%22%2C%22heatmap_gridlines%22%3Afalse%2C%22heatmap_gridlines_empty%22%3Afalse%2C%22heatmap_opacity%22%3A0.5%2C%22show_region_field%22%3Atrue%2C%22draw_map_labels_above_data%22%3Atrue%2C%22map_tile_provider%22%3A%22traffic_day%22%2C%22map_position%22%3A%22custom%22%2C%22map_scale_indicator%22%3A%22off%22%2C%22map_pannable%22%3Atrue%2C%22map_zoomable%22%3Atrue%2C%22map_marker_type%22%3A%22circle%22%2C%22map_marker_icon_name%22%3A%22shopping_cart%22%2C%22map_marker_radius_mode%22%3A%22proportional_value%22%2C%22map_marker_units%22%3A%22pixels%22%2C%22map_marker_proportional_scale_type%22%3A%22linear%22%2C%22map_marker_color_mode%22%3A%22fixed%22%2C%22show_view_names%22%3Afalse%2C%22show_legend%22%3Atrue%2C%22quantize_map_value_colors%22%3Afalse%2C%22reverse_map_value_colors%22%3Afalse%2C%22map_latitude%22%3A40.267214274019075%2C%22map_longitude%22%3A-94.70352172851564%2C%22map_zoom%22%3A4%2C%22map_marker_color%22%3A%5B%22%234595EC%22%5D%2C%22series_types%22%3A%7B%7D%2C%22type%22%3A%22looker_map%22%2C%22defaults_version%22%3A1%2C%22hidden_fields%22%3A%5B%22users.name%22%2C%22order_items.created_time%22%5D%7D&filter_config={}&origin=share-expanded&sdk=2&embed_domain=",
  "title": "Most Recent Orders"
}

const popularAnalysis = {
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

export const SplashPageContent = {
  "type": "splash page",
  "label": "Home",
  "description": "We're thrilled to have you on Atom Fashion - the premiere third party fashion marketplace for today's leading brands. Throughout this portal you will find a series of analytic content designed to help you maximize your performance.",
  "menuCategory": "home",
  "icon": HomeIcon,
  "component": SplashPage,
  "lookerContent": [
    bestWorstAnalysis,
    revenueByWeek,
    visitsByWeek,
    bounceRateByWeek,
    averageTimeByWeek,
    embeddedQuery,
    popularAnalysis
  ]
}