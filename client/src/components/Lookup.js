import React from 'react';
import Navigation from './Navigation'

import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6


class Lookup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            embed_url: '',
            codeBarIsVisible: false
        }
    }

    componentDidMount() {
        this.embedSdkInit()
    }


    embedSdkInit() {
        LookerEmbedSDK.createDashboardWithId(3106)
            .appendTo('#embedContainer')
            .withClassName('iframe')
            .withNext()
            .on('dashboard:run:start', (e) => { console.log(e) })
            .on('dashboard:filters:changed', (e) => this.filtersUpdates(e))
            .build()
            .connect()
            .then(this.setupDashboard)
            .catch((error) => {
                console.error('Connection error', error)
            })
    }


    filtersUpdates = (event) => {
        // console.log('filtersUpdates')
        // console.log('event', event)
        const dashboard_filters = event.dashboard.dashboard_filters
        // let new_filters = query_object.filters
        console.log('dashboard_filters', dashboard_filters)
        // console.log('new_filters', new_filters)

    }

    setupDashboard = (dashboard) => {
        // console.log('setupDashboard')
        // console.log('dashboard', dashboard)

        //save dashboard to state
        //to make available across functions
        this.setState({
            dashboard: dashboard
        }, () => {
            // console.log('setupDashboard callback')
            // console.log('this.state.dashboard', this.state.dashboard)
        })

    }

    toggleCodeBar = () => {
        console.log('toggleCodeBar')
        this.setState(prevState => ({
            codeBarIsVisible: prevState.codeBarIsVisible ? false : true
        }), () => {
            console.log('toggleCodeBar callback this.state.codeBarIsVisible', this.state.codeBarIsVisible)
        })
    }

    render() {
        const { pathname } = this.props.location
        const { codeBarIsVisible } = this.state
        return (
            <div className="home container p-5">
                <Navigation pathname={pathname} toggleCodeBar={this.toggleCodeBar} />
                <div className="row pt-5">
                    <div className="col-sm-10">
                        <div id="embedContainer" className="mt-3 pt-3 border-top">
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <ReactCSSTransitionGroup
                            transitionName="slide"
                            transitionAppear={true}
                            transitionAppearTimeout={500}
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={500}>
                            {codeBarIsVisible ? <p>For example, <code>&lt;section&gt;</code> should be wrapped as inline.</p>
                                : ''}
                        </ReactCSSTransitionGroup>
                    </div>
                </div >
            </div >
        )
    }
}
export default Lookup