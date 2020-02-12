import React from 'react';
import Navigation from './Navigation'
import './Home.css';

import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';


class Explore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            embed_url: '',
            explore: '',
            codeBarIsVisible: false,
            sampleCode: ''
        }
    }

    componentDidMount() {
        this.embedSdkInit()


        const sampleCodeFilePath = require("../sample-code/Explore.sample.txt");
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

    embedSdkInit() {
        LookerEmbedSDK.createExploreWithId('thelook_adwords::events')
            .appendTo('#embedContainer')
            .withClassName('iframe')
            .build()
            .connect()
            .then(this.setupExplore)
            .catch((error) => {
                console.error('Connection error', error)
            })
    }

    setupExplore = (explore) => {
        // console.log('setupExplore')
        // console.log('explore', explore)

        //save dashboard to state
        //to make available across functions
        this.setState({
            explore: explore
        }, () => {
            // console.log('setupDashboard callback')
            // console.log('this.state.dashboard', this.state.dashboard)
        })

    }

    toggleCodeBar = () => {
        // console.log('toggleCodeBar')
        this.setState(prevState => ({
            codeBarIsVisible: prevState.codeBarIsVisible ? false : true
        }), () => {
            // console.log('toggleCodeBar callback this.state.codeBarIsVisible', this.state.codeBarIsVisible)
        })
    }

    render() {
        const { pathname } = this.props.location
        const { codeBarIsVisible } = this.state
        const { sampleCode } = this.state
        return (
            <div className="home container p-5 position-relative">
                <Navigation pathname={pathname} toggleCodeBar={this.toggleCodeBar} />

                <div className="row pt-3">
                    <div id="embedContainer" className="col-sm-12 w-100">
                    </div>

                    <ReactCSSTransitionGroup
                        transitionName="slide"
                        transitionAppear={true}
                        transitionAppearTimeout={500}
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}>
                        {codeBarIsVisible ?
                            <div className="col-sm-8 position-absolute right-abs top-abs p-3 bg-light rounded">
                                <h4>Sample code:</h4>
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
export default Explore