import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
let { validIdHelper } = require('../../tools');

function CodeSideBar(props) {
    // console.log('CodeSideBar');
    // console.log('props', props);
    const { renderSampleCode, sampleCode, lookerUser, toggleCodeBar, demoComponentType } = props

    // return (
    //     renderSampleCode ?
    //         <ReactCSSTransitionGroup
    //             transitionName="slide"
    //             transitionAppear={true}
    //             transitionAppearTimeout={500}
    //             transitionEnterTimeout={500}
    //             transitionLeaveTimeout={500}>
    //             < div className="col-sm-8 position-absolute right-abs top-abs-0 p-3 bg-light rounded" >


    //                 <ul className="nav nav-tabs" id={`nestedTab`} role="tablist">

    //                     <li className="nav-item">
    //                         <a className="nav-link active "
    //                             id={validIdHelper(`sample-code-${demoComponentType}-tab`)}
    //                             data-toggle="tab"
    //                             href={validIdHelper(`#sample-code-${demoComponentType}`)}
    //                             role="tab"
    //                             aria-controls={validIdHelper(`sample-code-${demoComponentType}`)}
    //                             aria-selected="true"
    //                         >Sample Code</a>
    //                     </li>
    //                     <li className="nav-item">
    //                         <a className="nav-link"
    //                             id={validIdHelper(`user-properties-${demoComponentType}-tab`)}
    //                             data-toggle="tab"
    //                             href={validIdHelper(`#user-properties-${demoComponentType}`)}
    //                             role="tab"
    //                             aria-controls={validIdHelper(`user-properties-${demoComponentType}`)}
    //                             aria-selected="true"
    //                         >User Properties</a>
    //                     </li>

    //                     <button
    //                         type="button"
    //                         className="close ml-auto mr-2"
    //                         data-dismiss="modal"
    //                         aria-label="Close"
    //                         onClick={toggleCodeBar}
    //                     >
    //                         <span aria-hidden="true">&times;</span>
    //                     </button>
    //                 </ul>
    //                 <div className="tab-content" id={`nestedContent`}>
    //                     <div className="tab-pane fade show active" id={validIdHelper(`sample-code-${demoComponentType}`)} role="tabpanel" aria-labelledby={`sample-code-${demoComponentType}-tab`}>

    //                         <SyntaxHighlighter language="javascript" style={docco} showLineNumbers={true} >
    //                             {sampleCode}
    //                         </SyntaxHighlighter>
    //                     </div>

    //                     <div className="tab-pane fade" id={validIdHelper(`user-properties-${demoComponentType}`)} role="tabpanel" aria-labelledby={`user-properties-${demoComponentType}-tab`}>

    //                         <SyntaxHighlighter language="json" style={docco} showLineNumbers={true} >
    //                             {JSON.stringify(lookerUser, true, 4)}
    //                         </SyntaxHighlighter>
    //                     </div>
    //                 </div>
    //             </div >
    //         </ReactCSSTransitionGroup >
    //         : <li className="nav-item ml-auto mr-5 list-unstyled right-abs top-abs-20 abs"><i className="fas fa-code cursor text-secondary" onClick={toggleCodeBar} /></li>
    // )

    return (
        <SyntaxHighlighter language="json" style={docco} showLineNumbers={true} >
            {JSON.stringify(lookerUser, true, 4)}
        </SyntaxHighlighter>)
}

export default CodeSideBar