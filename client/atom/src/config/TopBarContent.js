
import { permissionLevels, rowLevelAttribute } from "./UserPermissionsContent";
const logo = require('../images/logo.svg').default

export const TopBarContent = {
  "usermenu": { permissionLevels, rowLevelAttribute },
  "avatar": logo,
  "avatarStyle": {
    "height": "40px",
    "fill": "white"
  }
}