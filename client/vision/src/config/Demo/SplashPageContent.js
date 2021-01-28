import SplashPage from '../../components/Demo/SplashPage/SplashPage';
import HomeIcon from '@material-ui/icons/Home'; //already declared



const totalDistributions =
{
  "id": "20",
  "gridWidth": 3,
  "type": "single value",
  "height": 120,
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
  "resultFormat": "json",
  "label": "Total Distributions",
  "visColor": "#F3A759",
  "chipFormat": "revenue"
}


// export const HomeContent = {
//   "type": "dashboard",
//   "label": "Home",
//   "menuCategory": "Home",
//   "description": "Overview of all your web traffic",
//   "icon": HomeIcon,
//   "component": Dashboard,
//   "lookerContent": [
//     {
//       "type": "dashboard",
//       "lookerMethod": "embedDashboard",
//       "id": "18",
//       "label": "Home",
//       "isNext": false
//     }],
//   "requiredPermissionLevel": 0
// }

export const SplashPageContent = {
  "type": "splash page",
  "label": "Home",
  "description": "We're thrilled to have you on Atom Fashion - the premiere third party fashion marketplace for today's leading brands. Throughout this portal you will find a series of analytic content designed to help you maximize your performance.",
  "menuCategory": "home",
  "icon": HomeIcon,
  "component": SplashPage,
  "lookerContent": [
    totalDistributions,
    // embeddedQuery,
  ],
  "requiredPermissionLevel": 0
}