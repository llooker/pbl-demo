import QueryBuilder from '../../components/Demo/QueryBuilder/QueryBuilder'
import SearchIcon from '@material-ui/icons/Search';

export const QueryBuilderContent = {
  "type": "query builder",
  "label": "Query Builder",
  "menuCategory": "operations",
  "description": "Enable business users to self serve on data and answer their own questions",
  "icon": SearchIcon,
  "component": QueryBuilder,
  "lookerContent": [
    {
      "type": "explorelite",
      "id": "explorelite",
      "label": "Build & Run Queries",
      "queryBody": {
        "model": "atom_fashion",
        "view": "order_items",
        "fields": [
          "order_items.created_month",
          "order_items.created_date",
          "order_items.created_week",
          "users.city",
          "users.state",
          "users.country",
          "products.category_type",
          "products.category",
          "products.brand",
          "order_items.total_sale_price",
          "order_items.total_tax_amount"
        ],
        "filters": {
          "users.state": "",
          "users.city": "",
          "users.country": "",
          "order_items.created_date": "6 months"
        },
        "limit": 500
      },
      "resultFormat": "json_detail",
      "fieldType": {
        "order_items.created_month": "dimension",
        "order_items.created_date": "dimension",
        "order_items.created_week": "dimension",
        "users.city": "dimension",
        "users.state": "dimension",
        "users.country": "dimension",
        "products.category_type": "dimension",
        "products.category": "dimension",
        "products.brand": "dimension",
        "order_items.total_sale_price": "measure",
        "order_items.total_tax_amount": "measure"
      },
      "filterType": {
        "users.state": "string",
        "users.city": "string",
        "users.country": "string",
        "order_items.created_date": "date"
      }
    }
  ],
  "requiredPermissionLevel": 0
}