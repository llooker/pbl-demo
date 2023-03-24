import {  Sparkline } from '@pbl-demo/components'
require('dotenv').config();
const NODE_ENV = process.env.NODE_ENV;

export  const bounceRateByWeek = {
  "component": Sparkline,
  "height": 120,
  "gridWidth": 3,
  "label": "Bounce Rate by Week",
  "queries": [
    {
      "qid": NODE_ENV === "local" ? "RmvV6yjtQRg9FgEWipkblO" : "4tnuH4rWFERYpwV2PAB8K5",
      "height": 30,
      "gridWidth": 6,
      "config": {
        "type": "single_value", 
        "series": [{
          "color": "#343D4E",
          "value_format": "0\%" 
        }]
        }
    },
    {
      "qid": NODE_ENV==="local" ? "VlE0ZeqBxKPlxaOI0nkXTU" : "Ha6D52aPiAo2MYIvX7wtOj",
      "height": 80,
      "gridWidth": 12,
      "config": {
        "type": "sparkline", 
        "legend": "false",
        "y_axis": [{ gridlines: false, label: false, values: false, range: ['auto', 'auto'] }],
        "x_axis": [{ gridlines: false, label: false, values: false }],
        "series": [
          {
            "color": "#E24E3A",
            "label": false,
          }
        ]
      }
    }
  ]
}