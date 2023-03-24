import {  Sparkline } from '@pbl-demo/components'
require('dotenv').config();
const NODE_ENV = process.env.NODE_ENV;

export  const visitsByWeek = {
  "component": Sparkline,
  "height": 120,
  "gridWidth": 3,
  "label": "Visits by Week",
  "queries": [
    {
      "qid": NODE_ENV === "local" ? "tU4WelafrMKLd6l63gEqpy" : "XrmzfIRPKQl1c4iCFQ5EN2",
      "height": 30,
      "gridWidth": 6,
      "config": {
        "type": "single_value", 
        // "value_format":"0.00,+\"K\"",
        "series": [{
          "color": "#343D4E",
        }]
        }
    },
    {
      "qid": NODE_ENV === "local" ? "WWLTCnJftu1HMS9V5mfiWJ" : "OT7ZOTO0Ik0EIGwl2zTj8g",
      "height": 80,
      "gridWidth": 12,
      "config": {
        
        "type": "sparkline", 
        "legend": "false",
        "y_axis": [{ gridlines: false, label: false, values: false, range: ['auto', 'auto'] }],
        "x_axis": [{ gridlines: false, label: false, values: false }],
        "series": [{
            "color": "#F3A759",
            "label": false
          }
        ]
      }
    }
  ]
}