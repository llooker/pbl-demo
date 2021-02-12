const logo = require('../images/logo_text.svg').default
const backgroundImageInt = Math.floor(Math.random() * 4) + 1;
const backgroundImage = require(`../images/background${backgroundImageInt}.jpg`).default

export const SignInContent = {
  "cardHeader": "Welcome",
  "cardBody": "Please sign in to access your fraud portal",
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