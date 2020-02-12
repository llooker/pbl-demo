import React from 'react';
import Navigation from './Navigation'
import './Home.css';

import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            folder_contents: {},
            looks: [],
            codeBarIsVisible: false,
            sampleCode: ''
        }
    }

    componentDidMount() {
        this.fetchFolderContents();



        const sampleCodeFilePath = require("../sample-code/Report.sample.txt");
        fetch(sampleCodeFilePath)
            .then(response => {
                return response.text()
            })
            .then(text => {
                this.setState({
                    sampleCode: text //marked(text)
                }, () => {
                    // console.log('then callback this.state.markdown', this.state.markdown)
                })
            })

    }

    async fetchFolderContents() {
        let lookerResposnse = await fetch('/fetchfolder/1827', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })

        let lookerResposnseData = await lookerResposnse.json();
        this.setState({
            folder_contents: lookerResposnseData.folder
        }, () => {
            // console.log('callback this.state.folder_contents')
            // console.log(this.state.folder_contents)
            this.embedSdkInit()
        });

    }

    embedSdkInit() {
        // console.log('embedSdkInit')
        let { looks } = this.state.folder_contents
        console.log('looks', looks)
        looks.map((item, index) => {
            console.log('item', item)
            let lookId = item.id
            let embedContainerId = '#embedContainer' + item.id
            console.log('embedContainerId', embedContainerId)
            LookerEmbedSDK.createLookWithId(lookId)
                .appendTo(embedContainerId)
                .withClassName('iframe')
                .build()
                .connect()
                .then(this.setupLook)
                .catch((error) => {
                    console.error('Connection error', error)
                })
        })
    }



    setupLook = (look) => {
        console.log('setupLook')
        console.log('look', look)

        this.setState(prevState => ({
            looks: [...prevState.looks, look]
        }), () => {
            // console.log('this.state.looks', this.state.looks)
            // console.log('this.state.looks.length', this.state.looks.length)
        })

    }

    toggleCodeBar = () => {
        console.log('toggleCodeBar')
        this.setState(prevState => ({
            codeBarIsVisible: prevState.codeBarIsVisible ? false : true
        }), () => {
            // console.log('toggleCodeBar callback this.state.codeBarIsVisible', this.state.codeBarIsVisible)
        })
    }

    render() {
        // console.log('this.props', this.props)
        const { pathname } = this.props.location
        const { folder_contents } = this.state
        const { codeBarIsVisible } = this.state
        const { sampleCode } = this.state
        return (
            < div className="home container p-5  position-relative" >
                <Navigation pathname={pathname} toggleCodeBar={this.toggleCodeBar} />
                {/* <div className="row pt-5">
                    <h3>demo.looker > folder 1827</h3>
                </div> */}
                <div className="row pt-3">
                    <div className="col-3 border-right">
                        <h6 className="text-dark">Select Report</h6>
                        <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">

                            {folder_contents.looks && folder_contents.looks.length ? folder_contents.looks.map((item, index) => {
                                return (
                                    <a key={item.id} className={index === 0 ? "nav-link active show" : "nav-link"} id={`v-pills-${item.id}-tab`} data-toggle="pill" href={`#v-pills-${item.id}`} role="tab" aria-controls={`v-pills-${item.id}`} aria-selected="false">{item.title}</a>
                                )
                            }) : <span>no looks :(</span>}

                        </div>
                    </div>
                    <div className="col-9">
                        <div className="tab-content" id="v-pills-tabContent">
                            {folder_contents.looks && folder_contents.looks.length ? folder_contents.looks.map((item, index) => {
                                return (
                                    <div key={item.id} className={index === 0 ? "tab-pane fade active show" : "tab-pane fade"} id={`v-pills-${item.id}`} role="tabpanel" aria-labelledby={`v-pills-${item.id}-tab`}>
                                        <h6 className="text-dark">{item.title}</h6>
                                        <div id={`embedContainer${item.id}`} className="col-sm-12">
                                        </div>
                                    </div>
                                )
                            }) : <span>no looks :(</span>}
                        </div>
                    </div>

                    <ReactCSSTransitionGroup
                        transitionName="slide"
                        transitionAppear={true}
                        transitionAppearTimeout={500}
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}>
                        {codeBarIsVisible ?
                            <div className="col-sm-8 position-absolute right-abs top-abs p-3 bg-light rounded">
                                <h4>Sample code that makes this work:</h4>
                                <SyntaxHighlighter language="javascript" style={docco} showLineNumbers={true} >
                                    {sampleCode}
                                </SyntaxHighlighter>
                            </div>
                            : ''}
                    </ReactCSSTransitionGroup>
                </div >
            </div >
        )
    }
}
export default Report