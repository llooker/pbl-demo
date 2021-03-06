
import { permissionLevels, rowLevelAttribute } from "./UserPermissionsContent";
const logo = require('../images/logo.svg').default

export const TopBarContent = {
  "usermenu": { permissionLevels, rowLevelAttribute, allowModal: true },
  "avatar": logo,
  "avatarStyle": {
    "maxHeight": "40px",
    "fill": "white"
  }
}