import SalesCalendar from '../../components/Demo/SalesCalendar/SalesCalendar'
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';


export const SalesCalendarContent = {
  "type": "custom vis",
  "label": "Sales Calendar",
  "menuCategory": "sales",
  "description": "Ayeeeeeee",
  "icon": DateRangeOutlinedIcon,
  "component": SalesCalendar,
  "lookerContent": [
    {
      "type": "custom vis",
      "lookerMethod": "runInlineQuery",
      "label": "Sales Calendar",
      "inlineQuery": {
        "model": "atom_fashion",
        "view": "order_items",
        "fields": [
          "order_items.created_date",
          "products.category",
          "order_items.order_count",
          "order_items.total_sale_price"
        ],
        "query_timezone": "America/Los_Angeles",
        "limit": "-1"
      },
      "desiredFilterName": "products.brand",
      "desiredFields": [
        "order_items.order_count",
        "order_items.total_sale_price"
      ],
      "resultFormat": "json"
    }
  ]
}