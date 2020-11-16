module.exports = {
  initialLookerUser: {
    "external_user_id": "",
    "first_name": "",
    "last_name": "",
    "session_length": 86400,
    "force_logout_login": true,
    "external_group_id": "",
    "group_ids": [
      4
    ],
    "permissions": [
      "access_data",
      "see_looks",
      "see_user_dashboards",
      "see_lookml_dashboards",
      "download_with_limit"
    ],
    "models": [
      "atom_fashion"
    ],
    "user_attributes": {
      "locale": "en_US",
      "country": "USA",
      "brand": "Calvin Klein",
      "time_horizon": "last 182 days",
      "permission_level": "basic"
    }
  },
  lookerUserAttributeBrandOptions: [
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
  ],
  lookerUserPermissions: {
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
  },
  lookerUserTimeHorizonMap: {
    "basic": "last 182 days",
    "advanced": "last 365 days",
    "premium": "last 730 days"
  }
}