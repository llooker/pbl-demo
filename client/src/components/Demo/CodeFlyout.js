import React, { useContext } from 'react';
import { Typography, Grid, Fade } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import SyntaxHighlighter from 'react-syntax-highlighter';
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs'; //hehe
import AppContext from '../../AppContext'

//helper function for rendering content in code tab
export default function CodeFlyout(props) {

  console.log('CodeFlyout')
  // console.log('props', props)
  const { toggleCodeShow } = useContext(AppContext);
  const { codeShow } = useContext(AppContext);
  console.log('toggleCodeShow', toggleCodeShow)

  const { classes, lookerContent, clientSideCode, serverSideCode, lookerUser, permissionNeededCode } = props
  return (

    <Fade in={codeShow || false}>
      <Grid item sm={12}
        className={`${classes.padding30}`}
        style={{ backgroundColor: 'rgb(40, 42, 54)', height: '100%', zIndex: 50000 }}>
        {/* {lookerContent.length ?
        <>
          <Typography variant="h5" component="h2" className={classes.gridTitle}>
            Looker Content Array Referenced on Page<br />
          </Typography>
          <CodeSnippet code={lookerContent} />
        </> : ''}
      {clientSideCode.length ?
        <>
          <Typography variant="h5" component="h2" className={classes.gridTitle}>
            Client Side Code<br />
          </Typography>
          <CodeSnippet code={clientSideCode} />
        </> : ''}
      {serverSideCode.length ?
        <>
          <Typography variant="h5" component="h2" className={classes.gridTitle}>
            Server Side Code<br />
          </Typography>
          <CodeSnippet code={serverSideCode} />
        </> : ''} */}
        {Object.keys(lookerUser).length ?
          <Grid container>
            <Grid item sm={6}>
              <Typography variant="h6" className={`${classes.gridTitle} ${classes.mrAuto}`} style={{ color: 'white' }}>
                Looker User Object
          </Typography></Grid>
            <Grid item sm={6} alignContent="center" style={{ textAlign: 'right' }}>
              <CloseIcon align="right" style={{ color: 'white', cursor: 'pointer' }} onClick={() => toggleCodeShow()} />
            </Grid>

            <CodeSnippet code={lookerUser} />
          </Grid> : ''}
        {/* {Object.keys(permissionNeededCode).length ?
        <>
          <CodeSnippet code={permissionNeededCode} />
        </> : ''} */}
      </Grid>
    </Fade>
  )
}

function CodeSnippet(props) {
  // console.log('CodeSnippet');
  // console.log('props', props);
  const { code } = props
  return (
    <SyntaxHighlighter language="json" style={dracula} showLineNumbers={true} >
      {typeof code === "object" ? JSON.stringify(code, true, 4) : code}
    </SyntaxHighlighter>)
}