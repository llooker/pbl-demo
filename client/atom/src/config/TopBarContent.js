
import { permissionLevels, rowLevelAttribute } from "./UserPermissionsContent";
const logo = require('../images/logo.svg').default
// const backgroundImageInt = Math.floor(Math.random() * 4) + 1;
// const backgroundImage = require(`../images/background${backgroundImageInt}.jpg`).default
const architectureDiagram = require("../images/ArchitectureDiagram.png").default

export const TopBarContent = {
  "usermenu": { permissionLevels, rowLevelAttribute, allowModal: true, 
    "backgroundImage": architectureDiagram,
    "backgroundImageStyle": {
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