import Dashboard from '../../components/Demo/Dashboard/Dashboard'
import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined';

export const InventoryOverviewContent = {
  "type": "custom filter",
  "label": "Inventory Overview",
  "menuCategory": "operations",
  "description": "Overview of your inventory",
  "icon": TableChartOutlinedIcon,
  "component": Dashboard,
  "lookerContent": [
    {
      "type": "dashboard",
      "lookerMethod": "embedDashboard",
      "id": "1",
      "isNext": false,
      "label": "Inventory Overview",
      "filters": [
        {
          "label": "Select Product Name",
          "filterName": "Product Name",
          "lookerMethod": "runInlineQuery"
        },
        {
          "label": "Dynamic Tiles",
          "options": [
            "Inventory",
            "Orders"
          ],
          "value": "tileToggleValue",
          "onChangeFunctionName": "handleTileToggle"
        },
        {
          "label": "Dynamic Vis Config",
          "options": [
            "#2d4266",
            "#43606b",
            "#414c67"
          ],
          "value": "visColorToggleValue",
          "onChangeFunctionName": "handleVisColorToggle"
        }
      ],
      "inlineQueries": [
        {
          "model": "atom_fashion",
          "view": "order_items",
          "fields": [
            "products.item_name"
          ],
          "query_timezone": "America/Los_Angeles"
        }
      ],
      "desiredFilterNames": [
        "products.brand"
      ],
      "filterComponents": [
        "autocomplete",
        "togglebutton",
        "togglebutton",
        "switch",
        "select"
      ],
      "dynamicFieldLookUp": {
        "Inventory": [
          "Inventory On Hand",
          "# of Items on Hand",
          "Most Popular Out of Stock Items",
          "Overstocked Items",
          "Aging Inventory"
        ],
        "Orders": [
          "# Orders Processing",
          "Total Amount Processing",
          "# Orders In Transit",
          "Order Shipment Status",
          "Open Orders to be Shipped"
        ]
      },
      "dynamicThemeMode": {
        "title": "gfy"
      },
      "dynamicThemeFont": {
        "title": "gfy"
      },
      "dynamicVisConfig": {
        "title": "gfy",
        "colors": {
          "#2d4266": [
            "#2d4266",
            "#416098",
            "#5780cd",
            "#6391e8"
          ],
          "#43606b": [
            "#43606b",
            "#4a7880",
            "#66a99d",
            "#a3d9a9"
          ],
          "#414c67": [
            "#414c67",
            "#64689b",
            "#9682cd",
            "#b48ee4"
          ]
        },
        "series_cell_visualizations": {
          "#2d4266": {
            "palette_id": "a3425339-dbbb-2584-0e23-38ed7d87ed50",
            "collection_id": "b43731d5-dc87-4a8e-b807-635bef3948e7",
            "custom_colors": [
              "#6391e8",
              "#2d4266"
            ]
          },
          "#43606b": {
            "palette_id": "c5182d25-00a3-cd71-eed3-4056299dd78f",
            "collection_id": "atom-fashion",
            "custom_colors": [
              "#a3d9a9",
              "#43606b"
            ]
          },
          "#414c67": {
            "palette_id": "7e059aa1-0d23-dab1-dbf9-a751ab7f54fb",
            "collection_id": "b43731d5-dc87-4a8e-b807-635bef3948e7",
            "custom_colors": [
              "#b48ee4",
              "#414c67"
            ]
          }
        }
      },
      "theme": "light_arial"
    }
  ]
}