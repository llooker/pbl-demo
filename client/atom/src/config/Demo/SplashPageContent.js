import HomeIcon from '@material-ui/icons/Home';
import { SplashPage } from '@pbl-demo/components'
import { codeSandboxes } from '@pbl-demo/utils';
import {bestWorstAnalysis, embeddedQuery, revenueByWeek, visitsByWeek, bounceRateByWeek, averageTimeByWeek} from './SplashPage'
const { api_run_query, embedded_query, visualization_component } = codeSandboxes

export const SplashPageContent = {
  "type": "splash page",
  "label": "Home",
  "description": "We're thrilled to have you on Atom Fashion - the premiere third party fashion marketplace for today's leading brands. Throughout this portal you will find a series of analytic content designed to help you maximize your performance.",
  "menuCategory": "home",
  "icon": HomeIcon,
  "component": SplashPage,
  "lookerContent": [
    bestWorstAnalysis,
    revenueByWeek,
    visitsByWeek,
    bounceRateByWeek, 
    averageTimeByWeek,
    embeddedQuery,
  ],
  "requiredPermissionLevel": 0,
  "codeFlyoutContent": [
    api_run_query,
    embedded_query,
    visualization_component
  ]
}