import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
let { validIdHelper } = require('../tools');

function CodeSideBar(props) {
    // console.log('CodeSideBar');
    // console.log('props', props);
    const { renderSampleCode, sampleCode, lookerUser, toggleCodeBar } = props

    return (
        renderSampleCode ?
            <ReactCSSTransitionGroup
                transitionName="slide"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}>
                < div className="col-sm-8 position-absolute right-abs top-abs--20 p-3 bg-light rounded" >


                    <ul className="nav nav-tabs" id={`nestedTab`} role="tablist">

                        <li className="nav-item">
                            <a className="nav-link active show"
                                id={`sample-code-tab`}
                                data-toggle="tab"
                                href={`#sample-code`}
                                role="tab"
                                aria-controls={`sample-code`}
                                aria-selected="true"
                            >Sample Code</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link"
                                id={`user-properties-tab`}
                                data-toggle="tab"
                                href={`#user-properties`}
                                role="tab"
                                aria-controls={`user-properties`}
                                aria-selected="true"
                            >User Properties</a>
                        </li>

                        <button
                            type="button"
                            className="close ml-auto mr-2"
                            data-dismiss="modal"
                            aria-label="Close"
                            onClick={toggleCodeBar}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </ul>
                    <div className="tab-content" id={`nestedContent`}>
                        <div className="tab-pane fade show active" id={`sample-code`} role="tabpanel" aria-labelledby={`sample-code-tab`}>

                            <SyntaxHighlighter language="javascript" style={docco} showLineNumbers={true} >
                                {sampleCode}
                            </SyntaxHighlighter>
                        </div>

                        <div className="tab-pane fade" id={`user-properties`} role="tabpanel" aria-labelledby={`user-properties-tab`}>

                            <SyntaxHighlighter language="json" style={docco} showLineNumbers={true} >
                                {JSON.stringify(lookerUser, true, 4)}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                </div >
            </ReactCSSTransitionGroup >
            : <li className="nav-item ml-auto mr-5 list-unstyled right-abs top-abs-0 abs"><i className="fas fa-code cursor text-secondary" onClick={toggleCodeBar} /></li>
    )
}

export default CodeSideBar