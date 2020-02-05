import React from 'react';
import './Home.css';
import Sidebar from './Sidebar'

import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'

LookerEmbedSDK.init('demo.looker.com', '/auth')

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            embed_url: '',
            dropdownValue: '',
            dashboard: ''
        }
        // let gDashboard;
    }

    componentDidMount() {
        // this.buildLookerUrl();
        this.embedSdkInit()
    }

    // async buildLookerUrl() {
    //     let lookerResposnse = await fetch('/buildlookerdashboardurl/dashboards/5277', {
    //         method: 'GET',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json'
    //         }
    //     })

    //     let lookerResposnseData = await lookerResposnse.json();
    //     this.setState({
    //         embed_url: lookerResposnseData.embed_url
    //     }, () => {
    //         // console.log('this.state.embed_url')
    //         // console.log(this.state.embed_url)
    //     });

    // }


    embedSdkInit() {
        LookerEmbedSDK.createDashboardWithId(5277)
            .appendTo('#embedContainer')
            .withClassName('iframe')
            .withNext()
            // .on('dashboard:loaded', (e) => { console.log(e) }) //only available in looker 7
            // .on('dashboard:loaded', this.loadEvent) //only available in looker 7
            //runs when dashboard has begun loading
            .on('dashboard:run:start', (e) => { console.log(e) })
            //runs when dashboard has finished running and all tiles have finished loading and querying
            // .on('dashboard:run:complete', (e) => { console.log(e) })
            //created when tile starts loading or querying for data
            // .on('dashboard:tile:start', (e) => { console.log(e) })
            //created when a tile has finished running the query
            // .on('dashboard:tile:complete', (e) => { console.log(e) })

            .on('dashboard:filters:changed', (e) => this.filtersUpdates(e))
            .build()
            .connect()
            // .then((d) => {
            //     console.log('this is my then', d)
            //     this.setupDashboard(d)
            // })
            .then(this.setupDashboard)
            .catch((error) => {
                console.error('Connection error', error)
            })
    }


    loadEvent = (dashboard) => {
        console.log('loadEvent')
        console.log('dashboard', dashboard)
        // setDashboard(dashboard)

    }

    filtersUpdates = (event) => {
        console.log('filtersUpdates')
        console.log('event', event)
        const dashboard_filters = event.dashboard.dashboard_filters
        // let new_filters = query_object.filters
        console.log('dashboard_filters', dashboard_filters)
        // console.log('new_filters', new_filters)

    }

    setupDashboard = (dashboard) => {
        console.log('setupDashboard')
        console.log('dashboard', dashboard)


        //make dashboard available across functions
        //by applying to state
        this.setState({
            dashboard: dashboard
        }, () => {
            console.log('setupDashboard callback')
            console.log('this.state.dashboard', this.state.dashboard)
        })

    }

    dropdownSelect = (e) => {
        console.log('genderDropdownSelect')
        // console.log('e', e)
        this.setState({
            dropdownValue: e.target.value
        }, () => {
            console.log('dropdownSelect callback')
            console.log('this.state.dropdownValue', this.state.dropdownValue)

            this.state.dashboard.updateFilters({ "Attribution Source": this.state.dropdownValue })
            this.state.dashboard.run()

        })

    }

    render() {
        console.log('this.state.dropdownValue', this.state.dropdownValue)
        const { pathname } = this.props.location
        return (
            <div className="home container p-5">
                <div className="row pt-3">
                    <Sidebar pathname={pathname} />
                    <div className="col-sm-10">

                        <div className="row">

                            <div>
                                <select
                                    id="dropdownSelect"
                                    className="form-control"
                                    onChange={(e) => this.dropdownSelect(e)}
                                    type="select-one"
                                    value={this.state['dropdownValue']}
                                >
                                    <option
                                        key="first_touch"
                                        value="First Touch"
                                    >
                                        First Touch
                                    </option>
                                    <option
                                        key="last_touch"
                                        value="Last Touch"
                                    >
                                        Last Touch
                                    </option>
                                    <option
                                        key="multi_touch_linear"
                                        value="Multi-touch Linear"
                                    >
                                        Multi-touch Linear
                                    </option>
                                </select>
                            </div>


                        </div>
                        <div id="embedContainer" >
                        </div>
                    </div>
                </div >
            </div >
        )
    }
}

export default Home;

