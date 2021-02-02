const logo = require('../images/logo.svg').default
const backgroundImageInt = Math.floor(Math.random() * 4) + 1;
const backgroundImage = require(`../images/background${backgroundImageInt}.jpg`).default

export const SignInContent = {
  "cardHeader": "Welcome",
  "cardBody": "Please sign in to access your fraud portal",
  "logo": logo,
  "backgroundImage": backgroundImage
}