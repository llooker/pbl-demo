const logo = require('../images/logo_text.svg').default
const backgroundImageInt = Math.floor(Math.random() * 4) + 1;
const backgroundImage = require(`../images/background${backgroundImageInt}.jpg`).default

export const SignInContent = {
  "cardHeader": "Fraud detection and analysis application",
  "cardBody": "For technical inquiries or sign-in related issues please contact the Gov Portal admin team at admin@govportal.io",
  "logo": logo,
  "logoStyle": {
    "height": '150px',
    "width": "auto"
  },
  "backgroundImage": backgroundImage,
  "backgroundImageStyle": {
    "backgroundImage": `url(${backgroundImage})`,
    "backgroundSize": 'cover'
  }
}