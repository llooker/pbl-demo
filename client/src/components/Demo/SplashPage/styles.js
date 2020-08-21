import { makeStyles } from '@material-ui/core/styles';
import { red, green } from '@material-ui/core/colors';
const redPrimary = red[500];
const greenPrimary = green[500];
const redDark = red[900];
const greenDark = green[900];
const redLight = red[100];
const greenLight = green[100];

export default makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  flexCentered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hidden: {
    visibility: 'hidden',
    position: 'absolute', //hack for obscuring other elements within Box
    zIndex: -1
  },
  tabs: {
    backgroundColor: 'white',
    color: '#6c757d'
  },
  dNone: {
    display: 'none'
  },
  dBlock: {
    display: 'block'
  },
  tree: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
  icon: {
    marginRight: 12,
    fontSize: '1rem',
    overflow: 'visible'
  },
  mt12: {
    marginTop: 12
  },
  w100: {
    width: '100%'
  },
  mlAuto: {
    marginLeft: 'auto'
  },
  skeleton: {
    minWidth: 275,
    minHeight: 600,
  },
  card: {
    minWidth: 275,
  },
  maxHeight200: {
    maxHeight: 200,
    height: 200,
    overflow: 'hidden'
  },
  mt30: {
    marginTop: 30
  },
  mb30: {
    marginBottom: 30
  },
  textCenter: {
    textAlign: 'center'
  },
  cursorPointer: {
    cursor: 'pointer'
  },
  border: {
    border: '1px solid black'
  },
  height800: {
    height: 800
  },
  maxHeight100: {
    maxHeight: 100,
    height: 100,
  },
  maxHeight400: {
    maxHeight: 400,
    height: 400,
  },
  minHeight680: {
    minHeight: 680,
  },
  minHeight200: {
    minHeight: 200,
    overflow: 'scroll'
  },
  redNeg: {
    backgroundColor: redLight,
    color: redPrimary,
    fontWeight: 800
  },
  greenPos: {
    backgroundColor: greenLight,
    color: greenPrimary,
    fontWeight: 800
  },
  padding30: {
    padding: 30
  },
  mb12: {
    marginBottom: 12
  },
  overflowScroll: {
    overflow: 'scroll'
  },
  overflowHidden: {
    overflow: 'hidden'
  },
  overflowVisible: {
    overflow: 'visible'
  },
  maxHeight150: {
    maxHeight: 150,
    height: 150,
  },
  minHeight150: {
    minHeight: 150,
    overflow: 'scroll'
  },
  carouselLegend: {
    backgroundColor: 'rgb(192,192,192, .5)	 !important',
    fontSize: '24px !important',
    textAlign: 'center !important',
    opacity: `100 !important`,
    fontWeight: 800,
    // width: `${25}% !important`,
  },
  positionTopRight: {
    position: 'absolute',
    top: -30,
    right: -50,
    bottom: 0,
    zIndex: 100
  },
  positionRelative: {
    position: 'relative'
  },
  padding15: {
    padding: 15
  },
  maxHeight75: {
    maxHeight: 75,
    height: 75,
  },
  overflowYScroll: {
    overflowY: 'scroll',
    overflowX: 'hidden'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  // .container {
  //   position: relative;
  //   width: 100vw;
  //   height: 100vh;
  // }
  // .container > iframe {
  //   position: absolute;
  //   top: -60px;
  //   width: 100%;
  //   height: calc(100% + 60px);
  // }
}));