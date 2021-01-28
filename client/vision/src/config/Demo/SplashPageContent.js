import HomeIcon from '@material-ui/icons/Home';
import { SingleValue, EmbeddedQuery, SplashPage } from '@pbl-demo/components'


const distributionsCurrentMonth =
{
  "id": "20",
  "gridWidth": 4,
  "type": "single value",
  "height": 80,
  "inlineQuery": {
    "model": "vision",
    "view": "_application",
    "fields": [
      "_payments.total_distribution"
    ],
    "filters": {
      "_payments.date_date": "this month"
    },
    "limit": "500"
  },
  "resultFormat": "json_detail",
  "label": "Total Disbursed MTD",
  "visColor": "#F3A759",
  "chipFormat": "revenue",
  "component": SingleValue
}

const distributionsPreviousMonth =
{
  "id": "20",
  "gridWidth": 4,
  "type": "single value",
  "height": 80,
  "inlineQuery": {
    "model": "vision",
    "view": "_application",
    "fields": [
      "_payments.total_distribution"
    ],
    "filters": {
      "_payments.date_date": "last month"
    },
    "limit": "500"
  },
  "resultFormat": "json_detail",
  "label": "Dispersed Last Month",
  "visColor": "#F3A759",
  "chipFormat": "revenue",
  "component": SingleValue
}


const distributionsFlaggedForReivew =
{
  "id": "20",
  "gridWidth": 4,
  "type": "single value",
  "height": 80,
  "inlineQuery": {
    "model": "vision",
    "view": "_application",
    "fields": [
      "_payments.total_distribution"
    ],
    "filters": {
      "_case.status": "pending"
    },
    "limit": "500"
  },
  "resultFormat": "json_detail",
  "label": "Total Distributions Flagged for Review",
  "visColor": "#F3A759",
  "chipFormat": "revenue",
  "component": SingleValue
}

const embeddedQuery =
{
  "gridWidth": 12,
  "height": 350,
  "type": "embeddedquery",
  "id": "12",
  "queryUrl": "embed/query/vision/_application?fields=_case.id,_application.id,_case.opened_date,_person.first_name,_person.last_name,_person.email_address,_person.gender,_application.household_id,_case.reason_code,_application.date_date,_person.ssn,_person.phone_number,_case.status,_payments.total_distribution&f[_case.status]=pending&f[_person.first_name]=-NULL&sorts=_person.last_name&limit=500&column_limit=50&vis=%7B%22show_view_names%22%3Afalse%2C%22show_row_numbers%22%3Atrue%2C%22transpose%22%3Afalse%2C%22truncate_text%22%3Atrue%2C%22hide_totals%22%3Afalse%2C%22hide_row_totals%22%3Afalse%2C%22size_to_fit%22%3Atrue%2C%22table_theme%22%3A%22white%22%2C%22limit_displayed_rows%22%3Afalse%2C%22enable_conditional_formatting%22%3Afalse%2C%22header_text_alignment%22%3A%22left%22%2C%22header_font_size%22%3A12%2C%22rows_font_size%22%3A12%2C%22conditional_formatting_include_totals%22%3Afalse%2C%22conditional_formatting_include_nulls%22%3Afalse%2C%22type%22%3A%22looker_grid%22%2C%22defaults_version%22%3A1%7D&filter_config=%7B%22_case.status%22%3A%5B%7B%22type%22%3A%22%3D%22%2C%22values%22%3A%5B%7B%22constant%22%3A%22pending%22%7D%2C%7B%7D%5D%2C%22id%22%3A0%2C%22error%22%3Afalse%7D%5D%2C%22_person.first_name%22%3A%5B%7B%22type%22%3A%22%21null%22%2C%22values%22%3A%5B%7B%22constant%22%3A%22%22%7D%2C%7B%7D%5D%2C%22id%22%3A1%2C%22error%22%3Afalse%7D%5D%7D&dynamic_fields=%5B%5D&origin=share-expanded&sdk=2&embed_domain=",
  "title": "Top Records for Investigation",
  "component": EmbeddedQuery
}


export const SplashPageContent = {
  "type": "splash page",
  "label": "Home",
  "description": "We're thrilled to have you on Atom Fashion - the premiere third party fashion marketplace for today's leading brands. Throughout this portal you will find a series of analytic content designed to help you maximize your performance.",
  "menuCategory": "Home",
  "icon": HomeIcon,
  "component": SplashPage,
  "lookerContent": [
    distributionsCurrentMonth,
    distributionsPreviousMonth,
    distributionsFlaggedForReivew,
    embeddedQuery
  ],
  "requiredPermissionLevel": 0
}