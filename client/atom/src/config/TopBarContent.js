
import { permissionLevels, rowLevelAttribute } from "./UserPermissionsContent";
const logo = require('../images/logo.svg').default
const backgroundImageInt = Math.floor(Math.random() * 4) + 1;
const backgroundImage = require(`../images/background${backgroundImageInt}.jpg`).default

export const TopBarContent = {
  "usermenu": { permissionLevels, rowLevelAttribute, allowModal: true, 
    "backgroundImage": backgroundImage,
    "backgroundImageStyle": {
      "backgroundImage": `url(${backgroundImage})`,
      "backgroundSize": 'cover',
      "borderRadius": '0'
    } },
  "avatar": logo,
  "avatarStyle": {
    "maxHeight": "40px",
    "fill": "white"
  },
}