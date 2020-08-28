import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    overflow: 'scroll',
    borderRadius: '8px'
  },
  card: {
    minWidth: 275,
    minHeight: 400,
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
  ml24: {
    marginLeft: 24
  },
  parentHoverVisibility: {
    '&:hover $childHoverVisibility': {
      visibility: 'visible'
    }

  },
  childHoverVisibility: {
    visibility: 'hidden'
  },
  faSm: {
    fontSize: '.75em'
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
  padding30: {
    padding: 30
  },
  mr12: {
    marginRight: 12
  },
  ml12: {
    marginLeft: 12
  },
  height100Percent: {
    height: '100%'
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
  }
}));