import React from 'react';
import Sidebar from './Sidebar'

import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'


class Lookup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            embed_url: ''
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

    render() {
        const { pathname } = this.props.location
        return (
            <div className="home container p-5">
                <div className="row pt-3">
                    <Sidebar pathname={pathname} />
                    <div className="col-sm-10">
                        <div id="embedContainer" className="mt-3 pt-3 border-top">
                        </div>
                    </div>
                </div >
            </div >
        )
    }
}
export default Lookup