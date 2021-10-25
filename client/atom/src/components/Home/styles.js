import { packageNameTheme } from '../../config/theme.js'
import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 260;
const topHeaderHeight = 64;
const bottomHeaderHeight = 48;
const topDrawerHeight = 52;
const additionalPadding = 30;
export const topAndBottomHeaderSpacing = topHeaderHeight + bottomHeaderHeight + additionalPadding;
export const topAndBottomHeaderPlusDrawerOpen = 0;

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  hero: {
    position: 'absolute',
    top: '100px',
    right: '-160px',
    '@media (min-height: 855px)': {
      top: 'auto',
      bottom: 0,
    },
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    zIndex: 1201,
    backgroundColor: packageNameTheme.palette.fill.main
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  leftDrawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  leftDrawerPaper: {
    width: drawerWidth,
    borderRight: '1px solid #e1dedf',
    backgroundColor: 'white',
    padding: '0 20px 20px',
  },
  leftContent: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  leftContentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  menuHeaderListItem: {
    alignItems: 'flex-end',
    display: 'flex',
    marginLeft: '-15px',
  },
  menuHeaderListItemText: {
    fontSize: '0.9em',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  menuHeaderListItemFiller: {
    borderBottom: '1px solid #bbbbbb',
    flex: 1,
    marginBottom: '5px',
    marginLeft: '10px',
  },
  menuListItem: {
    backgroundColor: '#EFF2F8',
    borderRadius: '100px',
    display: 'inline-flex',
    padding: '2px 22px 2px 12px',
    width: 'auto',
    color: "#418CDD",
    marginBottom: "1rem"
  },
  menuListItemThumbnailContainer:{
    border: ".5px solid #418CDD", 
    borderRadius: "5px", 
    overflow: "hidden", 
    marginBottom: "1rem"
  },
  menuListItemThumbnailHeader: {
    display: "flex", 
    alignItems: "center", 
    margin: ".25rem .5rem", 
    cursor: "pointer"
  },
  menuListItemIcon: {
    minWidth: '36px',
    color: "#418CDD"
  },
  vectorThumbnail: {
    maxHeight: "72px",
    overflow: "hidden"
  },
  //top drawer
  topDrawer: {
    // width: '100%',
    height: topDrawerHeight,
    flexShrink: 0,
  },
  topDrawerPaper: {
    width: '100%',
    backgroundColor: 'rgb(229, 229, 229)'
  },
  topContent: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginTop: 0,
  },
  topContentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginTop: topDrawerHeight,
  },
  title: {
    flexGrow: 1,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  dNone: {
    display: 'none'
  },
  dBlock: {
    display: 'block'
  },
  relative: {
    position: 'relative'
  },
  absolute: {
    position: 'absolute'
  },
  right0: {
    right: 0
  },
  top0: {
    top: 0
  },
  right24: {
    right: 24
  },
  top24: {
    top: 24
  },
  ml12: {
    marginLeft: 12
  },
  mr12: {
    marginRight: 12
  },
  mt12: {
    marginTop: 12
  },
  highlightLegend: {
    position: 'fixed',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    zIndex: 1200
  },
  tree: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400
  },
  parentHoverVisibility: {
    '&:hover $childHoverVisibility': {
      visibility: 'visible'
    }

  },
  childHoverVisibility: {
    visibility: 'hidden'
  },
  fontSize1em: {
    fontSize: '1em'
  },
  padding10: {
    padding: 10
  },
  mt5: {
    marginTop: 5
  },
  mb5: {
    marginBottom: 5
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'transparent'
    // theme.palette.background.paper,
  },
  mlAuto: {
    marginLeft: 'auto'
  },
  mrAuto: {
    marginRight: 'auto'
  },
  appBarBottom: {
    top: 'auto',
    bottom: 0,
    backgroundColor: 'white',
    color: '#418CDD',
    zIndex: 1300,
    boxShadow: '0px 0px 4px 2px rgba(0, 0, 0, 0.12)'
  },
  appBarBottomButtonSelected: {
    color: "#9295B0",
    background: "#EFF2F8"
  },
  hidden: {
    visibility: 'hidden'
  },
  roundedTab: {
    borderRadius: '100px'
  },
  paddingBottom30: {
    paddingBottom: 30
  },
  mtAuto: {
    marginTop: 'auto'
  },
  mb10: {
    marginBottom: 10
  },
  modalPopover: {
    position: 'absolute',
    width: 1000,
    height: 604,
    overflow: 'scroll',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
  },
  modalCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'scroll',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.05)',
      transition: 'transform .2s'
    }
  },
  noWrap: {
    whiteSpace: "nowrap"
  },
  paddingTB2: {
    paddingTop: 2,
    paddingBottom: 2
  },
  padding0: {
    padding: 0
  },
  content: {
    flex: 1,
    display: "flex",
    overflow: "auto"
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
  themeFillColor: {
    backgroundColor: packageNameTheme.palette.fill.main
  },
  borderRadius100: {
    borderRadius: 100
  },
  noBorder: {
    border: "1px solid transparent"
  }
}), { index: 1 });
