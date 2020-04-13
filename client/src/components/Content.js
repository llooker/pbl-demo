import React, { useState, useEffect } from 'react';
import './Home.css';
// import Modal from './Modal'

import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import $ from 'jquery';
// import { parse } from 'querystring';


import SplashPage from './SplashPage';
import CustomFilter from './CustomFilter';
import DashboardOverviewDetail from './DashboardOverviewDetail';
import ReportBuilder from './ReportBuilder';
import CodeSideBar from './CodeSideBar';
import UsecaseContent from '../usecaseContent.json';

const { validIdHelper } = require('../tools');

// start of material
// import Button from '@material-ui/core/Button';
// import Box from '@material-ui/core/Box';
// import Container from '@material-ui/core/Container';
// import Typography from '@material-ui/core/Typography';
// import Link from '@material-ui/core/Link';

// import { render } from '@testing-library/react';



// LookerEmbedSDK.init('demo.looker.com', '/auth')
let defaultNewLookerContentObj = {
    type: {
        value: 'dashboard',
        type: 'select-one',
        options: ['dashboard', 'explore', 'folder']
    },
    id: {
        value: '',
        type: 'text'
    },
    name: {
        value: '',
        type: 'text'
    }
}

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderSampleCode: false,
            sampleCode: {},
            activeTabType: 'dashboard',
            renderModal: false,
            //set to desired empty object onload
            newLookerContent: defaultNewLookerContentObj,
            newLookerContentErrorMessage: '',
            renderSideBar: true,
            activeDemoComponent: 'overview',
            splashPageContent: []
        }
    }


    componentDidMount(props) {
        console.log('LookerContent componentDidMount')
        // const { lookerContent } = this.props
        // console.log('props', props)

        const sampleCodeFilePath = require("../sample-code/dashboard.sample.txt");
        fetch(sampleCodeFilePath)
            .then(response => {
                return response.text()
            })
            .then(text => {
                this.setState({
                    sampleCode: text
                })
            })


        LookerEmbedSDK.init(`${this.props.lookerHost}.looker.com`, '/auth')
    }

    componentDidUpdate(prevProps) {
        // console.log('LookerContent componentDidUpdate')
        if (this.props.lookerContent != undefined && this.props.lookerContent !== prevProps.lookerContent) {
            this.setupLookerContent(UsecaseContent.marketing.demoComponents)
        }

        // if (this.props.lookerUser != undefined && this.props.lookerUser !== prevProps.lookerUser) {
        // LookerEmbedSDK.init(`${this.props.lookerHost}.looker.com`, '/auth')
        // }
    }



    async setupLookerContent(usecaseContent) {
        // console.log('setupLookerContent')
        // console.log('usecaseContent', usecaseContent)

        //delete old content..?
        let embedContainerArray = document.getElementsByClassName("embedContainer");
        for (let h = 0; h < embedContainerArray.length; h++) {
            let thisEmbedContainerId = embedContainerArray[h].id
            document.getElementById(thisEmbedContainerId).innerHTML = ''
        }

        for (let j = 0; j < usecaseContent.length; j++) {


            for (let i = 0; i < usecaseContent[j].lookerContent.length; i++) {

                // console.log('usecaseContent[j].lookerContent[i]', usecaseContent[j].lookerContent[i])

                if (usecaseContent[j].lookerContent[i].type === 'dashboard') {
                    // let paramsObj = demoComponents[j].type === 'custom filter' ?
                    //     { "_theme": JSON.stringify({ "show_title": false, "show_filters_bar": false }) } :
                    //     { "_theme": JSON.stringify({ "show_title": true, "show_filters_bar": true }) };

                    let desiredTheme = usecaseContent[j].type === 'custom filter' ? "no_filter" : "Looker"
                    // console.log('usecaseContent[j].type', usecaseContent[j].type)
                    // console.log('desiredTheme', desiredTheme)

                    LookerEmbedSDK.createDashboardWithId(usecaseContent[j].lookerContent[i].id)
                        .appendTo(validIdHelper(`#embedContainer${usecaseContent[j].lookerContent[i].id}`))
                        .withClassName('iframe')
                        .withNext()
                        // .withFilters() //new
                        .withTheme('Looker') //new
                        // .withParams({ _theme: JSON.stringify({ "show_filters_bar": true }) })
                        .on('dashboard:run:start', (e) => {
                            // console.log('e', e)
                        })
                        .on('drillmenu:click', (e) => this.drillClick(e))
                        .on('dashboard:filters:changed', (e) => this.filtersUpdates(e))
                        // .on('page:properties:changed', (e) => {
                        //     this.changeHeight(e, `embedContainer${lookerContent[i].id}`)
                        // })
                        .build()
                        .connect()
                        .then((dashboard) => {
                            this.setState({
                                [usecaseContent[j].lookerContent[i].id]: dashboard //5277
                            })
                            // this.changeHeight(dashboard, `embedContainer${lookerContent[i].id}`)
                        })
                        .catch((error) => {
                            console.error('Connection error', error)
                        })
                } else if (usecaseContent[j].lookerContent[i].type === 'explore') {
                    LookerEmbedSDK.createExploreWithId(usecaseContent[j].lookerContent[i].id)
                        .appendTo(validIdHelper(`#embedContainer${usecaseContent[j].lookerContent[i].id}`))
                        .withClassName('iframe')
                        // .withParams({
                        //     qid: 'DA0G4JnmvuxE2N1UEs3WHR',
                        //     toggle: 'dat,pik,vis'
                        // })
                        .build()
                        .connect()
                        .then(this.setupExplore)
                        .catch((error) => {
                            console.error('Connection error', error)
                        })

                } else if (usecaseContent[j].lookerContent[i].type === 'folder') {
                    let lookerResposnse = await fetch('/fetchfolder/' + usecaseContent[j].lookerContent[i].id, { //+ usecaseContent[j].type + '/'
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        }
                    })


                    let lookerResponseData = await lookerResposnse.json();

                    let looksToUse = [...lookerResponseData.sharedFolder.looks, ...lookerResponseData.embeddedUserFolder.looks]
                    let dashboardsToUse = [...lookerResponseData.sharedFolder.dashboards]
                    let objToUse = {
                        looks: looksToUse,
                        dashboards: dashboardsToUse
                    }
                    // console.log('objToUse', objToUse)

                    {
                        objToUse.looks.length ?
                            objToUse.looks.map((item, index) => {
                                let lookId = item.id
                                LookerEmbedSDK.createLookWithId(lookId)
                                    .appendTo(validIdHelper(`#embedContainer${usecaseContent[j].lookerContent[i].id}`))
                                    .withClassName('iframe')
                                    .withClassName('look')
                                    .withClassName(lookerResponseData.sharedFolder.looks.indexOf(item) > -1 ? "shared" : "personal")
                                    .on('drillmenu:click', (e) => this.drillClick(e))
                                    .build()
                                    .connect()
                                    .then(this.setupLook)
                                    .catch((error) => {
                                        console.error('Connection error', error)
                                    })
                            }) : ''
                    }


                    {
                        objToUse.dashboards.length ? objToUse.dashboards.map((item, index) => {
                            let dashboardId = item.id
                            LookerEmbedSDK.createDashboardWithId(dashboardId)
                                .appendTo(validIdHelper(`#embedContainer${usecaseContent[j].lookerContent[i].id}`))
                                .withClassName('iframe')
                                .withClassName('dashboard')
                                .withClassName(lookerResponseData.sharedFolder.dashboard.indexOf(item) > -1 ? "shared" : "personal")
                                .on('drillmenu:click', (e) => this.drillClick(e))
                                .build()
                                .connect()
                                .then(this.setupLook)
                                .catch((error) => {
                                    console.error('Connection error', error)
                                })
                        }) : ''
                    }
                }
                else if (usecaseContent[j].lookerContent[i].type === "api") {
                    // console.log('inside api else ifff')
                    // let lookerResposnse = await fetch('/fetchdashboard/' + usecaseContent[j].lookerContent[i].id, { //+ usecaseContent[j].type + '/'
                    // console.log('/runquery/' + usecaseContent[j].lookerContent[i].id + '/' + usecaseContent[j].lookerContent[i].result_format)
                    let lookerResposnse = await fetch('/runquery/' + usecaseContent[j].lookerContent[i].id + '/' + usecaseContent[j].lookerContent[i].result_format, {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        }
                    })


                    let lookerResponseData = await lookerResposnse.json();
                    // console.log('lookerResponseData', lookerResponseData);

                    this.setState((prevState) => ({
                        splashPageContent: [...prevState.splashPageContent, lookerResponseData]
                    }), () => {
                        // console.log('usecaseContent api callback')
                        // console.log('this.state.splashPageContent', this.state.splashPageContent)
                    })

                }
            }

        }
    }

    //need to revisit if this is working...?
    dropdownSelect = (e) => {
        const targetId = e.target.id
        const dashboardStateName = e.target.getAttribute("dashboardstatename");
        const dropdownFilterName = e.target.getAttribute("dropdownfiltername");
        this.setState({
            [targetId]: e.target.value
        }, () => {
            this.state[dashboardStateName].updateFilters({ [dropdownFilterName]: this.state[targetId] })
            this.state[dashboardStateName].run()
        })
    }


    toggleCodeBar = () => {
        this.setState(prevState => ({
            renderSampleCode: prevState.renderSampleCode ? false : true
        }))
    }

    // could I combine these???
    setActiveTab = (tabIndex) => {
        // console.log('setActiveTab')
        // console.log('tabIndex', tabIndex)

        if (this.state.renderSampleCode) this.toggleCodeBar();

        let tabsArray = $(".parentTabList:visible a");
        let contentArray = $(".parentTabContent:visible > div");

        //simulate tab change, when looker action taken...
        if (!$(tabsArray[tabIndex]).hasClass('active')) {
            for (let i = 0; i < tabsArray.length; i++) {
                if (i === tabIndex) {
                    tabsArray[i].className = "nav-link active show"
                    contentArray[i].className = "tab-pane fade show active"
                } else {
                    tabsArray[i].className = "nav-link"
                    contentArray[i].className = "tab-pane fade"
                }
            }
        }

        let newTabContentType = $(tabsArray[tabIndex]).attr('contenttype');
        // console.log('newTabContentType', newTabContentType)
        if (newTabContentType) {
            this.setState({
                activeTabType: newTabContentType
            }, () => {
                const sampleCodeFilePath = require(`../sample-code/${newTabContentType}.sample.txt`);
                fetch(sampleCodeFilePath)
                    .then(response => {
                        return response.text()
                    })
                    .then(text => {
                        this.setState({
                            sampleCode: text
                        })
                    })
            })
        }
    }

    setActiveDemoComponent = (pillIndex) => {
        // console.log('setActiveDemoComponent')
        // console.log('pillIndex', pillIndex)
        let pillsArray = $("#v-pills-tab:visible a");
        let contentArray = $("#v-pills-tabContent:visible > div");

        if (!$(pillsArray[pillIndex]).hasClass('active')) {
            for (let i = 0; i < pillsArray.length; i++) {
                if (i === pillIndex) {
                    pillsArray[i].className = "nav-link active show"
                    contentArray[i].className = "tab-pane fade show active"
                } else {
                    pillsArray[i].className = "nav-link"
                    contentArray[i].className = "tab-pane fade"
                }
            }
        }

        $(window).scrollTop(0);
        //call activeTab once pill has been organized
        this.setActiveTab(0);

    }

    toggleModal = () => {
        if (this.state.renderModal) {
            this.setState({
                newLookerContent: defaultNewLookerContentObj,
                newLookerContentErrorMessage: ''
            })
        }

        this.setState(prevState => ({
            renderModal: prevState.renderModal ? false : true
        }))
    }

    handleModalFormChange = (e) => {
        // console.log('handleModalFormChange')
        // console.log('e.target.dataset.key', e.target.dataset.key)
        let objCopy = { ...this.state.newLookerContent }
        objCopy[e.target.dataset.key] = {
            value: e.target.value,
            type: e.target.type
        }
        this.setState({
            renderModal: true,
            newLookerContent: objCopy
        })
    }



    validateLookerContent = async (newLookerContent) => {
        // console.log('validateLookerContent')
        // console.log('newLookerContent', newLookerContent)

        let objToUse = {
            type: newLookerContent.type.value,
            id: newLookerContent.id.value,
            name: newLookerContent.name.value
        }

        if (objToUse.type && objToUse.id && objToUse.name) {
            let lookerResposnse = await fetch('/validatelookercontent/' + objToUse.id + '/' + objToUse.type, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })

            let lookerResposnseData = await lookerResposnse.json();

            if (lookerResposnseData.content_metadata_id) {
                this.props.saveLookerContent(objToUse) //here we make call to save...
                this.toggleModal()
            } else {
                this.setState(prevState => ({
                    newLookerContentErrorMessage: lookerResposnseData.errorMessage || 'Invalid id!'
                }))
            }

        } else {
            this.setState(prevState => ({
                newLookerContentErrorMessage: 'All fields are required!'
            }))
        }

    }

    // need to think this through more, seems to be significant performance issues :/
    // also not well suited for tabular structure :/
    // leave for now but comment out invocation
    changeHeight(event, containerId) {
        // console.log('changeHeight')
        // console.log('event', event)
        // console.log('containerId', containerId)
        const div = document.getElementById(containerId)
        if (event && event.height && div) {
            div.style.height = `${event.height + 20}px`
        }
    }

    drillClick(event) {
        // console.log('drillClick')
        // console.log('event', event)
        const isCampaignPerformanceDrill = (event.label === 'Campaign Performance Dashboard') ? true : false
        if (isCampaignPerformanceDrill) {

            // const parsedUrl = new URL(event.url)
            // const stateName = decodeURIComponent(parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf('/') + 1, parsedUrl.pathname.length))
            // const filterName = decodeURIComponent(parsedUrl.search.substring(1, parsedUrl.search.indexOf('=')))
            // const filterValue = decodeURIComponent(parsedUrl.search.substring(parsedUrl.search.indexOf('=') + 1, parsedUrl.search.length))

            const url = event.url;
            let stateName = decodeURIComponent(url.substring(url.lastIndexOf('/') + 1, url.indexOf('?')));
            const filterName = decodeURIComponent(url.substring(url.indexOf('?') + 1, url.indexOf('=')));
            const filterValue = decodeURIComponent(url.substring(url.lastIndexOf('=') + 1, url.length));

            if (stateName === 'pwSkck3zvGd1fnhCO7Fc12') stateName = 3106; // hack for now...
            //urls changed to relative, need slugs to work across instances?

            this.state[stateName].updateFilters({ [filterName]: filterValue })
            this.state[stateName].run()

            this.setActiveTab(1)

            return { cancel: (isCampaignPerformanceDrill) ? true : false }
        }
    }

    //async 
    /*filtersUpdates(event) {
        // loadingIcon(true);
        // console.log('filtersUpdates')
        // console.log('event', event)
    
        // instantiate elements, filters, and query objects
        // const dashboard_filters: any = (event && event.dashboard && event.dashboard.dashboard_filters) ? event.dashboard && event.dashboard.dashboard_filters : undefined
        // let dropdown = document.getElementById('select-dropdown')
        // let new_filters = query_object.filters
    
        // // update query object and run query
        // if (dashboard_filters && (dashboard_date_filter in dashboard_filters)) { // check to make sure our filter is in the changed
        //     if (dropdown) { // check to make sure we found our elements to update/keep
        //         new_filters = Object.assign(new_filters, { [query_date_filter]: dashboard_filters[dashboard_date_filter] })
        //         const states = await sdk.ok(sdk.run_inline_query(
        //             {
        //                 body: Object.assign(query_object, { filters: new_filters }),
        //                 result_format: 'json'
        //             }
        //         ))
        //         addStateOptions(states)
        //     }
        // }
        // loadingIcon(false)
        // if (dashboard_filters && dashboard_filters[dashbord_layout_filter] && dashboard_filters[dashbord_layout_filter]) {
        //     layoutFilter(dashboard_filters[dashbord_layout_filter])
        // }
    }*/


    toggleSideBar = () => {
        // console.log('toggleSideBar')

        this.setState(prevState => ({
            renderSideBar: prevState.renderSideBar ? false : true
        }), () => {
            // console.log('toggleSideBar callback', this.state.renderSideBar)
        })
    }

    render() {
        // console.log('Content render')
        // console.log('this.props', this.props)


        const { lookerContent, activeCustomization, lookerUser } = this.props
        const { renderSampleCode, sampleCode, renderModal, newLookerContent, newLookerContentErrorMessage, renderSideBar, splashPageContent } = this.state

        // let lookerUserCanExplore = lookerUser.permission_level === 'best' ? true : false;
        // console.log('lookerUserCanExplore', lookerUserCanExplore)
        return (

            <div className="home container-fluid p-5 position-relative">
                <div className="row pt-5">
                    <div className="col-sm-2">
                        <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">

                            {
                                UsecaseContent.marketing.demoComponents.map((item, index) => {
                                    return (
                                        <a
                                            id={validIdHelper(`v-pills-${item.type}-tab`)}
                                            className={index === 0 ? "nav-link active" : "nav-link"}
                                            data-toggle="pill"
                                            href={validIdHelper(`#v-pills-${item.type}`)}
                                            role="tab"
                                            aria-controls={validIdHelper(`#v-pills-${item.type}`)}
                                            aria-selected="true"
                                            onClick={() => {
                                                this.setActiveDemoComponent(index);
                                            }}>
                                            {item.label}
                                        </a>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="col-sm-10">
                        <div className="tab-content" id="v-pills-tabContent">

                            {
                                UsecaseContent.marketing.demoComponents.map((item, index) => {
                                    // hack for dynamic component name
                                    const Map = {
                                        "splash page": SplashPage,
                                        "custom filter": CustomFilter,
                                        "dashboard overview detail": DashboardOverviewDetail,
                                        "report builder": ReportBuilder
                                    }
                                    const DemoComponent = Map[item.type];
                                    return (
                                        <div className="tab-pane fade"
                                            id={validIdHelper(`v-pills-${item.type}`)}
                                            className={index === 0 ? "tab-pane fade show active" : "tab-pane fade"}
                                            role="tabpanel"
                                            aria-labelledby={validIdHelper(`v-pills-${item.type}-tab`)}>

                                            <DemoComponent key={validIdHelper(`v-pills-${item.type}`)}
                                                lookerContent={item.lookerContent}
                                                setActiveTab={this.setActiveTab}
                                                setActiveDemoComponent={this.setActiveDemoComponent}
                                                dropdownSelect={this.dropdownSelect}
                                                splashPageContent={splashPageContent}
                                            />

                                            {/* {
                                                renderModal ?
                                                    <Modal title="Select Looker Content to Add"
                                                        toggleModal={this.toggleModal}
                                                        objForModal={newLookerContent}
                                                        handleModalFormChange={this.handleModalFormChange}
                                                        validateAction={this.validateLookerContent}
                                                        newLookerContentErrorMessage={newLookerContentErrorMessage} />
                                                    : ''
                                            } */}

                                            {
                                                index > 0 ?
                                                    <CodeSideBar
                                                        renderSampleCode={renderSampleCode}
                                                        sampleCode={sampleCode}
                                                        lookerUser={lookerUser}
                                                        toggleCodeBar={this.toggleCodeBar} /> : ''
                                            }

                                        </div>
                                    )
                                })}
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default Content;