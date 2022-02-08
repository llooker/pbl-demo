import { EmbeddedQuery } from '@pbl-demo/components'

export const embeddedQuery = {
  gridWidth: 12,
  height: 780,
  type: "embeddedquery",
  queryUrl:
    "embed/query/atom_fashion/order_items?fields=order_items.created_time,users.name,order_items.total_sale_price,users.approx_location,users.city,products.category,users.country&f[users.country]=USA&f[products.category]=&sorts=order_items.created_time+desc&limit=100&query_timezone=America%2FLos_Angeles&vis=%7B%22map_plot_mode%22%3A%22points%22%2C%22heatmap_gridlines%22%3Afalse%2C%22heatmap_gridlines_empty%22%3Afalse%2C%22heatmap_opacity%22%3A0.5%2C%22show_region_field%22%3Atrue%2C%22draw_map_labels_above_data%22%3Atrue%2C%22map_tile_provider%22%3A%22traffic_day%22%2C%22map_position%22%3A%22custom%22%2C%22map_scale_indicator%22%3A%22off%22%2C%22map_pannable%22%3Atrue%2C%22map_zoomable%22%3Atrue%2C%22map_marker_type%22%3A%22circle%22%2C%22map_marker_icon_name%22%3A%22shopping_cart%22%2C%22map_marker_radius_mode%22%3A%22proportional_value%22%2C%22map_marker_units%22%3A%22pixels%22%2C%22map_marker_proportional_scale_type%22%3A%22linear%22%2C%22map_marker_color_mode%22%3A%22fixed%22%2C%22show_view_names%22%3Afalse%2C%22show_legend%22%3Atrue%2C%22quantize_map_value_colors%22%3Afalse%2C%22reverse_map_value_colors%22%3Afalse%2C%22map_latitude%22%3A40.267214274019075%2C%22map_longitude%22%3A-94.70352172851564%2C%22map_zoom%22%3A4%2C%22map_marker_color%22%3A%5B%22%234595EC%22%5D%2C%22series_types%22%3A%7B%7D%2C%22type%22%3A%22looker_map%22%2C%22defaults_version%22%3A1%2C%22hidden_fields%22%3A%5B%22users.name%22%2C%22order_items.created_time%22%5D%7D&filter_config={}&origin=share-expanded&sdk=2&embed_domain=",
  title: "Most Recent Orders",
  categoryFilter: {
    query: {
      result_format: "json",
      body: {
        model: "atom_fashion",
        view: "order_items",
        fields: [
          "products.category",
          "product_images",
          "order_items.total_gross_margin",
        ],
        filters: {
          "order_items.created_week": "1 weeks",
        },
        sorts: [],
        limit: "500",
        dynamic_fields: JSON.stringify([
          {
              "table_calculation": "change",
              "label": "Week over Week %25 Change",
              // eslint-disable-next-line no-template-curly-in-string
              "expression": "(${order_items.total_gross_margin}-offset(${order_items.total_gross_margin},1))/offset(${order_items.total_gross_margin},1)",
              "value_format": null,
              "value_format_name": "percent_2",
              "_kind_hint": "measure",
              "_type_hint": "number"
          },
          {
            measure: "product_images",
            based_on: "products.product_image",
            type: "list",
            label: "Product Images",
            expression: null,
            value_format: null,
            value_format_name: null,
            _kind_hint: "measure",
            _type_hint: "list",
          },
        ]),
      },
    },
    sortValue: d => d["order_items.total_gross_margin"],
    key: d => d["products.category"],
    change: d => d["change"],
    image: d => `https://storage.cloud.google.com/atom-products/${encodeURIComponent(d["product_images"][0])}.jpg`,
    label: d => d["products.category"]
  },
  component: EmbeddedQuery,
};