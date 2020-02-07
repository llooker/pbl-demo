import React from 'react';
import './Home.css';
import Sidebar from './Sidebar'

import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'

LookerEmbedSDK.init('demo.looker.com', '/auth')

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attributionDropdownValue: '',
            genderDropdownValue: '',
            attributionDropdownOptions: [],
            genderDropdownOptions: [],
            dashboard: ''
        }
    }

    componentDidMount() {
        // this.buildLookerUrl();
        this.retrieveDashboardFilters()
        this.embedSdkInit()
    }

    async retrieveDashboardFilters() {
        console.log('retrieveDashboardFilters')

        let lookerResposnse = await fetch('/retievedashboardfilters/5277', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        })

        let lookerResposnseData = await lookerResposnse.json();
        console.log('lookerResposnseData', lookerResposnseData)
        let optionsArr = [];
        lookerResposnseData.query.map(item => {
            console.log('item', item)
            console.log('item["users.gender"]', item["users.gender"])
            optionsArr.push(item["users.gender"] || null)
        })
        console.log('optionsArr', optionsArr)
        this.setState({
            genderDropdownOptions: optionsArr
        }, () => {
            console.log('retrieveDashboardFilters callback')
            console.log('this.state.genderDropdownOptions', this.state.genderDropdownOptions)
        })
    }




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

    // only available in Looker7
    /*loadEvent = (dashboard) => {
        console.log('loadEvent')
        console.log('dashboard', dashboard)
        // setDashboard(dashboard)

    }*/

    filtersUpdates = (event) => {
        console.log('filtersUpdates')
        console.log('event', event)
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
            console.log('setupDashboard callback')
            console.log('this.state.dashboard', this.state.dashboard)
        })

    }


    dropdownSelect = (e, desiredDropdown) => {
        // console.log('dropdownSelect')
        // console.log('e', e)
        // console.log('desiredDropdown', desiredDropdown)

        this.setState({
            [desiredDropdown + 'DropdownValue']: e.target.value
        }, () => {
            console.log('dropdownSelect callback')
            console.log("this.state[desiredDropdown + 'DropdownValue']", this.state[desiredDropdown + 'DropdownValue'])

            let filterName;
            if (desiredDropdown === "gender") {
                filterName = "User Gender"
            } else if (desiredDropdown === "attribution") {
                filterName = "Attribution Source"
            }
            this.state.dashboard.updateFilters({ [filterName]: this.state[desiredDropdown + 'DropdownValue'] })
            this.state.dashboard.run()

        })
    }

    render() {
        const { pathname } = this.props.location
        const { genderDropdownOptions } = this.state
        return (
            <div className="home container p-5">
                <div className="row pt-5">
                    <Sidebar pathname={pathname} />
                    <div className="col-sm-10">

                        <div className="row">
                            {/* Attribution Source */}
                            <div className="col-sm-3">
                                <label htmlFor="modalForm">Select Attribution Source</label>
                                <select
                                    id="dropdownSelect"
                                    className="form-control"
                                    onChange={(e) => this.dropdownSelect(e, "attribution")}

                                    type="select-one"
                                    value={this.state['attributionDropdownValue']}
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
                                        value="Multi-Touch Linear"
                                    >
                                        Multi-touch Linear
                                    </option>
                                </select>
                            </div>
                            {/* User Gender */}
                            <div className="col-sm-3">
                                <label htmlFor="modalForm">Select User Gender</label>
                                <select
                                    id="dropdownSelect"
                                    className="form-control"
                                    onChange={(e) => this.dropdownSelect(e, "gender")}
                                    type="select-one"
                                    value={this.state['genderDropdownValue']}
                                >
                                    {genderDropdownOptions.map(item => {
                                        return <option
                                            key={item == null ? 'Any' : item}
                                            value={item == null ? 'Any' : item}
                                        > {item == null ? 'Any' : item}</option>
                                    })}
                                </select>
                            </div>


                        </div>
                        <div id="embedContainer" className="mt-3 pt-3 border-top">
                        </div>
                    </div>
                </div >
            </div >
        )
    }
}

export default Home;

