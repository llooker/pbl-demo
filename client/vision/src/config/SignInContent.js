const signInLogo = require('../images/logo.svg').default
const backgroundImageInt = Math.floor(Math.random() * 4) + 1;
const signInBackgroundImage = require(`../images/background${backgroundImageInt}.jpg`)
console.log({ signInBackgroundImage })
export const SignInContent = {
  "cardHeader": "Welcome",
  "cardBody": "Please sign in to access your fraud portal",
  "signInLogo": signInLogo,
  "signInBackgroundImage": signInBackgroundImage
}