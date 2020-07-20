import React from 'react';
import { Typography, Grid } from '@material-ui/core'
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SyntaxHighlighter from 'react-syntax-highlighter';
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs'; //hehe

//helper function for rendering content in code tab
export default function CodeFlyout(props) {

  // console.log('CodeFlyout')
  // console.log('props', props)

  const { classes, lookerContent, clientSideCode, serverSideCode, lookerUser } = props
  return (
    <Grid item sm={12} >
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
        <>
          <Typography variant="h5" component="h2" className={classes.gridTitle}>
            Looker User Object<br />
          </Typography>
          <CodeSnippet code={lookerUser} />
        </> : ''}
    </Grid>
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