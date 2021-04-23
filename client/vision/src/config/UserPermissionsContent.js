export const permissionLevels = {
  "partner": [
    "access_data",
    "see_looks",
    "see_user_dashboards",
    "see_lookml_dashboards",
    "download_with_limit"
  ],
  "administrator": [
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
  "partner": "last 182 days",
  "administrator": "last 365 days"
}

export const initialUser = {
  "external_user_id": "",
  "first_name": "",
  "last_name": "",
  "session_length": 86400,
  "force_logout_login": true,
  "external_group_id": "",
  "group_ids": [
    4
  ],
  "permissions":
    permissionLevels[Object.keys(permissionLevels)[1]],
  "models": [
    "vision",
    "atom_fashion"
  ],
  "user_attributes": {
    "locale": "en_US",
    "country": "USA",
    "time_horizon": "last 182 days",
    "permission_level": Object.keys(permissionLevels)[1],
    "brand": "Calvin Klein",

  }
}

export const modalPermissionsMap = {
  "partner": {
    "title": "I'm a viewer",
    "list": [
      '6 months of order data history',
      'Atom Merchant Dashboards',
      'Download PDFs, CSVs'
    ]
  },
  "administrator": {
    "title": "I'm a manager",
    "list": [
      '2 Full years of order data history',
      'Analyze your own data and save custom reports',
      'View premium level, productivity enhancing reports',
      'Share your reports with colleagues in Atom',
      'Text message alerts',
    ]
  }
}

export const rowLevelAttribute = {
  // "autoCompleteLabel": "Change zip",
  // "menuItemLabel": "Current zip",
  // "options": [
  //   {
  //     "label": "10012"
  //   },
  //   {
  //     "label": "10013"
  //   },
  //   {
  //     "label": "10014"
  //   },
  //   {
  //     "label": "10015"
  //   },
  //   {
  //     "label": "10016"
  //   }
  // ]
}