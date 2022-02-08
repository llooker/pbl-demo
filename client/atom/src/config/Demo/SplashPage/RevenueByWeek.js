import {  Sparkline } from '@pbl-demo/components'
require('dotenv').config();
const NODE_ENV = process.env.NODE_ENV;

export  const revenueByWeek = {
  "component": Sparkline,
  "height": 120,
  "gridWidth": 3,
  "label": "Revenue by Week",
  "queries": [
    {
      "qid": NODE_ENV === "development" ? "dxwz50eER84k65PVoDGgdM" : "h2q8rf6DCBCJHnIvhk5VGe",
      "height": 30,
      "gridWidth": 6,
      "config": {
        "type": "single_value", 
        "series": [{
          "color": "#343D4E",
        }]
        }
    },
    {
      "qid": NODE_ENV === "development" ? "A0Lt4NhsSi74DSGeIpomf0" : "LY6uiwtZrcfcREdOEnexBx",
      "height": 80,
      "gridWidth": 12,
      "config": {
        
        "type": "sparkline", 
        "legend": "false",
        "y_axis": [{ gridlines: false, label: false, values: false, range: ['auto', 'auto'] }],
        "x_axis": [{ gridlines: false, label: false, values: false }],
        "series": [{
            "color": "#4595EC",
            "label": false
          }
        ]
      }
    }
  ]
}