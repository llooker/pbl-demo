import { makeStyles } from '@material-ui/core/styles';
import { grey, orange } from '@material-ui/core/colors';
const lightGrey = grey[200];


export default makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  root: {
    display: 'flex',
    backgroundColor: 'rgb(229, 229, 229)'
  },
  flexCentered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    minWidth: 350,
    minHeight: 500,
    left: '75%',
    top: '50%',
    transform: `translate(-75%, -50%)`,
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: lightGrey
  },
  h100: {
    height: '100%'
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  actions: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardCopy: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
    margin: '0',
    width: '80%',
  }
}));
