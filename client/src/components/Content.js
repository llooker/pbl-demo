import React, { useState, useEffect } from 'react';
import './Home.css';
// import Modal from './Modal'

import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import $ from 'jquery';
// import { parse } from 'querystring';

// import SideBar from './SideBar'

import CustomFilter from './CustomFilter';
import DashboardOverviewDetail from './DashboardOverviewDetail';
import ReportBuilder from './ReportBuilder';
import CodeSideBar from './CodeSideBar';
import DemoComponents from '../demoComponents.json';

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
            activeDemoComponent: 'overview'
        }
    }


    componentDidMount() {
        // console.log('LookerContent componentDidMount')
        // const { lookerContent } = this.props

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
            this.setupLookerContent(DemoComponents.marketing.demoComponents)
        }

        // if (this.props.lookerUser != undefined && this.props.lookerUser !== prevProps.lookerUser) {
        // LookerEmbedSDK.init(`${this.props.lookerHost}.looker.com`, '/auth')
        // }
    }



    async setupLookerContent(demoComponents) {
        // console.log('setupLookerContent')
        // console.log('demoComponents', demoComponents)

        //delete old content..?
        let embedContainerArray = document.getElementsByClassName("embedContainer");
        for (let h = 0; h < embedContainerArray.length; h++) {
            let thisEmbedContainerId = embedContainerArray[h].id
            document.getElementById(thisEmbedContainerId).innerHTML = ''
        }

        for (let j = 0; j < demoComponents.length; j++) {


            for (let i = 0; i < demoComponents[j].lookerContent.length; i++) {

                // console.log('demoComponents[j].lookerContent[i]', demoComponents[j].lookerContent[i])
                LookerEmbedSDK.createDashboardWithId
                if (demoComponents[j].lookerContent[i].type === 'dashboard') {
                    // let paramsObj = demoComponents[j].type === 'custom filter' ?
                    //     { "_theme": JSON.stringify({ "show_title": false, "show_filters_bar": false }) } :
                    //     { "_theme": JSON.stringify({ "show_title": true, "show_filters_bar": true }) };

                    let desiredTheme = demoComponents[j].type === 'custom filter' ? "no_filter" : "Looker"
                    // console.log('demoComponents[j].type', demoComponents[j].type)
                    // console.log('desiredTheme', desiredTheme)

                    LookerEmbedSDK.createDashboardWithId(demoComponents[j].lookerContent[i].id)
                        .appendTo(validIdHelper(`#embedContainer${demoComponents[j].lookerContent[i].id}`))
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
                                [demoComponents[j].lookerContent[i].id]: dashboard //5277
                            })
                            // this.changeHeight(dashboard, `embedContainer${lookerContent[i].id}`)
                        })
                        .catch((error) => {
                            console.error('Connection error', error)
                        })
                } else if (demoComponents[j].lookerContent[i].type === 'explore') {
                    LookerEmbedSDK.createExploreWithId(demoComponents[j].lookerContent[i].id)
                        .appendTo(validIdHelper(`#embedContainer${demoComponents[j].lookerContent[i].id}`))
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

                } else if (demoComponents[j].lookerContent[i].type === 'folder') {
                    let lookerResposnse = await fetch('/fetchfolder/' + demoComponents[j].lookerContent[i].id, { //+ demoComponents[j].type + '/'
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
                                    .appendTo(validIdHelper(`#embedContainer${demoComponents[j].lookerContent[i].id}`))
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
                                .appendTo(validIdHelper(`#embedContainer${demoComponents[j].lookerContent[i].id}`))
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

    setActiveTab = (tabIndex) => {
        console.log('setActiveTab')
        console.log('tabIndex', tabIndex)

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
        console.log('newTabContentType', newTabContentType)
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
        console.log('Content render')
        // console.log('this.props', this.props)

        const { lookerContent } = this.props
        const { renderSampleCode } = this.state
        const { sampleCode } = this.state
        const { renderModal } = this.state
        const { newLookerContent } = this.state
        const { activeCustomization } = this.props
        const { newLookerContentErrorMessage } = this.state
        let { lookerUser } = this.props

        const { renderSideBar } = this.state

        // let lookerUserCanExplore = lookerUser.permission_level === 'best' ? true : false;
        // console.log('lookerUserCanExplore', lookerUserCanExplore)
        return (

            <div className="home container-fluid p-5 position-relative">
                <div className="row pt-5">
                    <div className="col-sm-2">
                        <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">

                            <a className={"nav-link active"}
                                id={validIdHelper(`v-pills-${DemoComponents.marketing.splashPage.type}-tab`)}
                                data-toggle="pill"
                                href={validIdHelper(`#v-pills-${DemoComponents.marketing.splashPage.type}`)}
                                role="tab"
                                aria-controls={validIdHelper(`#v-pills-${DemoComponents.marketing.splashPage.type}`)}
                                aria-selected="true">
                                Home
                            </a>

                            {
                                DemoComponents.marketing.demoComponents.map((item, index) => {
                                    return (
                                        <a className="nav-link"
                                            id={validIdHelper(`v-pills-${item.type}-tab`)}
                                            data-toggle="pill"
                                            href={validIdHelper(`#v-pills-${item.type}`)}
                                            role="tab"
                                            aria-controls={validIdHelper(`#v-pills-${item.type}`)}
                                            aria-selected="true"
                                            onClick={() => {
                                                this.setState({
                                                    activeDemoComponent: validIdHelper(item.type)
                                                }, () => {
                                                    // console.log('onClick callback activeDemoComponent', this.state.activeDemoComponent)
                                                    setTimeout(() => { this.setActiveTab(0) }, 1000)
                                                })
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


                            <div className="tab-pane fade active show"
                                id={validIdHelper(`v-pills-${DemoComponents.marketing.splashPage.type}`)}
                                role="tabpanel"
                                aria-labelledby={validIdHelper(`v-pills-${DemoComponents.marketing.splashPage.type}-tab`)}>
                                <h2>{DemoComponents.marketing.splashPage.title}</h2>


                                <div className="row pt-3">
                                    {
                                        DemoComponents.marketing.demoComponents.map((item, index) => {
                                            // console.log('item', item)
                                            return (
                                                <div key={item.type} className="card ml-5 p-3" style={{ "width": 18 + 'rem' }}>
                                                    <div className="card-body">
                                                        <p className="card-text">stat {index + 1}</p>
                                                    </div>
                                                </div>)
                                        })
                                    }
                                </div>

                                <div className="row pt-5">
                                    {
                                        DemoComponents.marketing.demoComponents.map((item, index) => {
                                            // console.log('item', item)
                                            return (
                                                <div key={item.type} className="card ml-5 p-3" style={{ "width": 18 + 'rem' }}>
                                                    <div className="card-body">
                                                        <h5 className="card-title">{item.label}<i className={`fas ${item.iconClass} ml-3`} /></h5>
                                                        <p className="card-text">{item.description}</p>
                                                        {/* <Link to={`/${activeUsecase}/${key}`}>
                                                            <button type="button" className="btn btn-primary ">{thisDemoComponent.label}</button>
                                                        </Link> */}
                                                        <a class="btn btn-primary" href={`#v-pills-${validIdHelper(item.type)}`} role="button">{item.label}</a>

                                                    </div>
                                                </div>)
                                        })
                                    }
                                </div>
                            </div>

                            {
                                DemoComponents.marketing.demoComponents.map((item, index) => {
                                    // hack for dynamic component name
                                    const Map = {
                                        "custom filter": CustomFilter,
                                        "dashboard overview detail": DashboardOverviewDetail,
                                        "report builder": ReportBuilder
                                    }
                                    const DemoComponent = Map[item.type];
                                    return (
                                        <div className="tab-pane fade"
                                            id={validIdHelper(`v-pills-${item.type}`)}
                                            role="tabpanel"
                                            aria-labelledby={validIdHelper(`v-pills-${item.type}-tab`)}>

                                            <DemoComponent key={validIdHelper(`v-pills-${item.type}`)}
                                                lookerContent={item.lookerContent}
                                                setActiveTab={this.setActiveTab}
                                                dropdownSelect={this.dropdownSelect}
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

                                            <CodeSideBar
                                                renderSampleCode={renderSampleCode}
                                                sampleCode={sampleCode}
                                                lookerUser={lookerUser}
                                                toggleCodeBar={this.toggleCodeBar} />

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