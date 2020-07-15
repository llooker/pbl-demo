import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    minHeight: 680
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
    minHeight: 800,
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
  cursor: {
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
    overflow: 'hidden'
  },
  maxHeight400: {
    maxHeight: 400,
    height: 400,
    overflow: 'hidden',
  }
}));