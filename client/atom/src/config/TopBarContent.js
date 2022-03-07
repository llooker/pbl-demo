
import { permissionLevels, rowLevelAttribute } from "./UserPermissionsContent";
const logo = require('../images/logo.svg').default
const architectureDiagram = require("../images/ArchitectureDiagram.png").default

export const TopBarContent = {
  "usermenu": { permissionLevels, rowLevelAttribute, allowModal: true, 
    "src": architectureDiagram,
    "imageStyle": {
      "backgroundImage": `url(${architectureDiagram})`,
      "backgroundSize": 'cover',
      "borderRadius": '0',
      "maxWidth": "100%",
      "maxHeight": "auto"
    } },
  "avatar": logo,
  "avatarStyle": {
    "maxHeight": "40px",
    "fill": "white"
  },
}