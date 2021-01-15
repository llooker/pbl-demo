import React, { useContext } from 'react';
import { Typography, Grid, Fade, ClickAwayListener } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { appContextMap } from '../../utils/tools';

export const CodeFlyout = (props) => {
  const { codeShow, setCodeShow } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);

  const { classes, lookerUser, height } = props
  return (
    <ClickAwayListener onClickAway={() => {
      setCodeShow()
    }}
    >
      <Fade in={codeShow || false}>
        {Object.keys(lookerUser).length ?
          <Grid container spacing={3}
            className={`${classes.padding20} ${classes.codeFlyoutContainer}`}
            style={{ height }}>
            <Grid item sm={11}>
              <Typography variant="h6" className={` ${classes.mrAuto}`} style={{ color: 'white' }}>
                Looker User Object
            </Typography>
            </Grid>
            <Grid item sm={1}
              style={{ textAlign: 'right' }}
            >
              <CloseIcon style={{ color: 'white', cursor: 'pointer' }} onClick={() => setCodeShow()} />
            </Grid>
            <Grid item sm={12}>
              <CodeSnippet code={lookerUser} />
            </Grid>
          </Grid> : ''
        }
      </Fade >
    </ClickAwayListener >
  )
}

function CodeSnippet(props) {
  const { code } = props
  return (
    <SyntaxHighlighter language="json" style={dracula} showLineNumbers={true} >
      {typeof code === "object" ? JSON.stringify(code, true, 4) : code}
    </SyntaxHighlighter>)
}