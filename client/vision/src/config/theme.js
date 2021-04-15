import { createMuiTheme } from '@material-ui/core/styles'
import { grey } from '@material-ui/core/colors';

export const packageNameTheme = createMuiTheme({
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: grey[400],
    },
    fill: {
      main: "#240D67",
      secondary: "#4f3d85"
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'sans-serif'
    ].join(','),
    button: {
      textTransform: 'none'
    }
  },
})