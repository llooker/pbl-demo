import { Welcome } from '@pbl-demo/components'

export const bestWorstAnalysis = {
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
  "resultFormat": "json",
  "component": Welcome
}