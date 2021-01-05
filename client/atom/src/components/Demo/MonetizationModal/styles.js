import { makeStyles } from '@material-ui/core/styles';


export default makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 1000,
    height: 604,
    overflow: 'scroll',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // height: 520,
    overflow: 'scroll',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.05)',
      transition: 'transform .2s'
    }
  },
  flexCentered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  padding15: {
    padding: 15
  },
  divider: {
    marginTop: 15,
    marginBottom: 15,
    color: '#fff'
  },
  basic: {

  },
  advanced: {

  },
  premium: {
    // backgroundColor: '#5F6BD8',
    // color: '#ffffff'
  },
  font75: {
    fontSize: '.75em'
  },
  font875: {
    // fontSize: '.875em'
  },
  padding30: {
    padding: 30
  }
}));



