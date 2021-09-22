export const permissionLevels = {
  "basic": [
    "access_data",
    "see_looks",
    "see_user_dashboards",
    "see_lookml_dashboards",
    "download_with_limit"
  ],
  "advanced": [
    "access_data",
    "see_looks",
    "see_user_dashboards",
    "see_lookml_dashboards",
    "download_with_limit",
    "schedule_look_emails",
    "schedule_external_look_emails",
    "create_alerts",
    "see_drill_overlay"
  ],
  "premium": [
    "access_data",
    "see_looks",
    "see_user_dashboards",
    "see_lookml_dashboards",
    "download_with_limit",
    "schedule_look_emails",
    "schedule_external_look_emails",
    "create_alerts",
    "see_drill_overlay",
    "save_content",
    "embed_browse_spaces",
    "schedule_look_emails",
    "send_to_sftp",
    "send_to_s3",
    "send_outgoing_webhook",
    "send_to_integration",
    "download_without_limit",
    "explore",
    "see_sql"
  ]
}

export const userTimeHorizonMap = {
  "basic": "last 182 days",
  "advanced": "last 365 days",
  "premium": "last 730 days"
}

export const initialUser = {
  "external_user_id": "",
  "first_name": "",
  "last_name": "",
  "session_length": 86400, //5000,
  "force_logout_login": true,
  "external_group_id": "",
  "group_ids": [
    4
  ],
  "permissions":
    permissionLevels[Object.keys(permissionLevels)[0]],
  "models": [
    "atom_fashion",
    "query-builder"
  ],
  "user_attributes": {
    "locale": "en_US",
    "country": "USA",
    "brand": "Calvin Klein",
    "time_horizon": "last 182 days",
    "permission_level": Object.keys(permissionLevels)[0]
  }
}

export const modalPermissionsMap = {
  'basic': {
    "title": "Drive your business with clear KPIs",
    "list": [
      '6 months of order data history',
      'Atom Merchant Dashboards',
      'Download PDFs, CSVs'
    ]
  },
  'advanced': {
    "title": "Deeper insights, operations",
    "list": [
      'Full year of order data history',
      'Drill to row level information',
      'Download row level information',
      'Schedule dashboards for delivery (to you or others)',
      'Set alerts and key threshold notifications'
    ]
  },
  'premium': {
    "title": "Drive your business with Atom",
    "list": [
      '2 Full years of order data history',
      'Analyze your own data and save custom reports',
      'View premium level, productivity enhancing reports',
      'Share your reports with colleagues in Atom',
      'Text message alerts',
      // 'Notify active shoppers on Atom',
      // 'Apply Atom’s advanced AI insights to stay ahead of trends'
    ]
  }
}

export const rowLevelAttribute = {
  "autoCompleteLabel": "Change brand",
  "menuItemLabel": "Current brand",
  "options": [
    {
      "label": "Columbia"
    },
    {
      "label": "Calvin Klein"
    },
    {
      "label": "Carhartt"
    },
    {
      "label": "Levi's"
    },
    {
      "label": "Dockers"
    }
  ]
}