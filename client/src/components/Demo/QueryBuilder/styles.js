import { makeStyles } from '@material-ui/core/styles';
import { grey, orange } from '@material-ui/core/colors';

const greyPrimary = grey[400];
const greySecondary = grey[100];
const orangePrimary = orange[400];
const orangeSecondary = orange[100];

export default makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
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
  ml12: {
    marginLeft: 12
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
  table: {
    minWidth: 650,
  },
  tableContainer: {
    maxHeight: 650,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  skeleton: {
    minWidth: 275,
    minHeight: 600,
  },
  card: {
    minWidth: 275,
    minHeight: 400
  },
  textCenter: {
    textAlign: 'center'
  },
  bluePrimary: {
    backgroundColor: 'rgba(69, 149, 236, 1)'
  },
  blueSecondary: {
    backgroundColor: 'rgba(69, 149, 236, .5)',
  },
  orangePrimary: {
    backgroundColor: 'rgba(243, 167, 89, 1)'
  },
  orangeSecondary: {
    backgroundColor: 'rgba(243, 167, 89, .5)'
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
  bottomBarSpacer: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  maxHeight600: {
    maxHeight: 600,
    overflow: 'scroll'
  },
  padding30: {
    padding: 30
  },
  m12: {
    margin: 12
  },
  m6: {
    margin: 6
  },
  height100Percent: {
    height: '100%'
  }
}));