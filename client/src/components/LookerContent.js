import React from 'react';
import Navigation from './Navigation'
import './Home.css';
import Modal from './Modal'

import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';



LookerEmbedSDK.init('demo.looker.com', '/auth')

class LookerContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attributionDropdownValue: '',
            genderDropdownValue: '',
            attributionDropdownOptions: [],
            genderDropdownOptions: [],
            dashboard: '',
            codeBarIsVisible: false,
            sampleCode: {}
        }
    }


    componentDidMount() {

    }
    render() {
        console.log('Home render')
        return (

            <div className="home container p-5 position-relative">
                <h1> here we are...</h1>
            </div>
        )
    }
}


export default LookerContent;