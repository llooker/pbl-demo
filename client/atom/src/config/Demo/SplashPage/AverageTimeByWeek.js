import {  Sparkline } from '@pbl-demo/components'
require('dotenv').config();
const NODE_ENV = process.env.NODE_ENV;

export  const averageTimeByWeek = {
  "component": Sparkline,
  "height": 120,
  "gridWidth": 3,
  "label": "Average Time on Site by Week",
  "queries": [
    {
      "qid": NODE_ENV === "development" ? "mGmaPsZvhj6k7rTz8jnrn0" : "eORQJoOqyMFboV1yefPZG0",
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
      "id": NODE_ENV === "development" ? "2047" : "FFpbdqCrAHlXAEmR1qMm1z",
      "height": 80,
      "gridWidth": 12,
      "config": {
        
        "type": "sparkline", 
        "legend": "false",
        "y_axis": [{ gridlines: false, label: false, values: false, range: ['auto', 'auto'] }],
        "x_axis": [{ gridlines: false, label: false, values: false }],
        "series": [{
            "color": "#65AB5A",
            "label": false
          }
        ]
      }
    }
  ]
}