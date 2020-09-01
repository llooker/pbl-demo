import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    overflow: 'scroll',
    borderRadius: '8px'
  },
  flexCentered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hidden: {
    visibility: 'hidden',
    // position: 'absolute', //hack for obscuring other elements within Box
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
  card: {
    minWidth: 275,
    minHeight: 400
  },
  height500: {
    height: 500
  },
  height600: {
    height: 600
  },
  height700: {
    height: 700
  },
  height800: {
    height: 800
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  skeleton: {
    height: 160,
    width: '100%'
  },
  padding30: {
    padding: 30
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
  height100Percent: {
    height: '100%'
  },
  ml12: {
    marginLeft: 12
  },
  padding20: {
    padding: 20
  },
  positionFixedTopRight: {
    position: 'fixed',
    top: 88,
    right: 24,
    bottom: 0,
    zIndex: 100,
  },
  codeFlyoutContainer: {
    backgroundColor: 'rgb(40, 42, 54)',
    overflow: 'scroll',
    borderRadius: '0 8px 8px 0'
  },
  padding10: {
    padding: 10
  },
  overflowScroll: {
    overflow: 'scroll'
  },
  noContainerScroll: {
    width: '100%',
    margin: 0
  }
}));