import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
let { validIdHelper } = require('../../tools');

function CodeSideBar(props) {
    // console.log('CodeSideBar');
    // console.log('props', props);
    const { code } = props
    return (
        <SyntaxHighlighter language="json" style={docco} showLineNumbers={true} >
            {typeof code === "object" ? JSON.stringify(code, true, 4) : code}
        </SyntaxHighlighter>)
}

export default CodeSideBar