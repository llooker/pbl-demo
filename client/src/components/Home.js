import React from 'react';
import Navigation from './Navigation'
import './Home.css';

import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';



LookerEmbedSDK.init('demo.looker.com', '/auth')

class Home extends React.Component {
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
        console.log('Home componentDidMount')
        console.log('this.state.isLoading', this.state.isLoading)
        this.retrieveDashboardFilters()
        this.embedSdkInit()


        const sampleCodeFilePath = require("../sample-code/Home.sample.txt");
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

    async retrieveDashboardFilters() {
        // console.log('retrieveDashboardFilters')

        let lookerResposnse = await fetch('/retievedashboardfilters/5277', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        })
        let lookerResposnseData = await lookerResposnse.json();

        let optionsArr = [];
        lookerResposnseData.query.map(item => {
            optionsArr.push(item["users.gender"] || null)
        })
        this.setState({
            genderDropdownOptions: optionsArr,
            isLoading: false
        }, () => {
            // console.log('retrieveDashboardFilters callback')
            // console.log('this.state.genderDropdownOptions', this.state.genderDropdownOptions)
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

    //never finished
    filtersUpdates = (event) => {
        // console.log('filtersUpdates')
        // console.log('event', event)
        const dashboard_filters = event.dashboard.dashboard_filters
        // let new_filters = query_object.filters
        // console.log('dashboard_filters', dashboard_filters)
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


    dropdownSelect = (e, desiredDropdown) => {
        // console.log('dropdownSelect')
        // console.log('e', e)
        // console.log('desiredDropdown', desiredDropdown)

        this.setState({
            [desiredDropdown + 'DropdownValue']: e.target.value
        }, () => {

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

    toggleCodeBar = () => {
        console.log('toggleCodeBar')
        this.setState(prevState => ({
            codeBarIsVisible: prevState.codeBarIsVisible ? false : true
        }), () => {
            // console.log('toggleCodeBar callback this.state.codeBarIsVisible', this.state.codeBarIsVisible)
        })
    }

    render() {
        console.log('Home render')
        console.log('this.state.isLoading', this.state.isLoading)
        const { pathname } = this.props.location
        const { genderDropdownOptions } = this.state
        const { codeBarIsVisible } = this.state
        const { sampleCode } = this.state
        return (
            <div className="home container p-5 position-relative">
                <Navigation pathname={pathname} toggleCodeBar={this.toggleCodeBar} />
                <div className="row pt-3">
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
                {/* works but does push embed container :() */}
                <div className="row">
                    <div id="embedContainer" className="col-sm-12 mt-3 pt-3 border-top w-100">
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

export default Home;
