import { packageNameTheme } from '../../config/theme.js'
import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 240;
export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    backgroundColor: 'rgb(229, 229, 229)'
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    zIndex: 1201,
    backgroundColor: packageNameTheme.palette.fill.main
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    borderRight: 'none',
    backgroundColor: 'transparent'
  },
  drawerPaper: {
    width: drawerWidth,
    borderRight: 'none',
    backgroundColor: 'transparent'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
    // backgroundColor: '#343D4E',
    // color: '#ffff'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
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
  nested: {
    paddingLeft: theme.spacing(4),
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
    // backgroundColor: 'transparent'
  },
  hidden: {
    visibility: 'hidden'
  },
  roundedTab: {
    borderRadius: '0 100px 100px 0'
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
}), { index: 1 });


