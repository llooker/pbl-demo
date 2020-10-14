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
    // zIndex: -1
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
  mrAuto: {
    marginRight: 'auto'
  },
  card: {
    minWidth: 275,
    // minHeight: 400,
  },
  padding30: {
    padding: 30
  },
  minHeight680: {
    minHeight: 680,
  },
  positionRelative: {
    position: 'relative'
  },
  skeleton: {
    height: 160,
    width: '100%'
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
  noContainerScroll: {
    width: '100%',
    margin: 0
  },
  verticalAlignTop: {
    verticalAlign: 'top'
  },
  w33: {
    width: "33%"
  },
  mr12: {
    marginRight: 12
  },
  dot: {
    height: "25px",
    width: "25px",
    borderRadius: "50%",
    display: "inline-block"
  }
}));