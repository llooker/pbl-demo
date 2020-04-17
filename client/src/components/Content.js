import React, { useState, useEffect } from 'react';
import './Home.css';
import './simple-sidebar.css';
// import Modal from './Modal'

import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import $ from 'jquery';
// import { parse } from 'querystring';

// import Header from './Header'
// import Footer from './Footer'
import SplashPage from './Demo/SplashPage_OLD';
import CustomFilter from './Demo/CustomFilter';
import DashboardOverviewDetail from './Demo/DashboardOverviewDetail';
import ReportBuilder from './Demo/ReportBuilder';
import ComingSoon from './Demo/ComingSoon';
import CodeSideBar from './CodeSideBar';

import UsecaseContent from '../usecaseContent.json';

//start of material
// import MainLayout from './Home_FUNCTIONAL';






const { validIdHelper } = require('../tools');





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
            splashPageContent: [],
            customDropdownOptions: [],
            reportBuilderContent: {}
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
        this.setupLookerContent(UsecaseContent.marketing.demoComponents)
    }

    componentDidUpdate(prevProps) {
        console.log('LookerContent componentDidUpdate')
        if (this.props.lookerContent != undefined) { //&& this.props.lookerContent !== prevProps.lookerContent) {
            // console.log('inside ifff');
            // this.setupLookerContent(UsecaseContent.marketing.demoComponents)
        }

        // if (this.props.lookerUser != undefined && this.props.lookerUser !== prevProps.lookerUser) {
        //     LookerEmbedSDK.init(`${this.props.lookerHost}.looker.com`, '/auth')
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


                    if (usecaseContent[j].lookerContent[i].hasOwnProperty('customDropdown')) {

                        let stringifiedQuery = encodeURIComponent(JSON.stringify(usecaseContent[j].lookerContent[i].customDropdown.inlineQuery))
                        let lookerResponse = await fetch('/runinlinequery/' + stringifiedQuery + '/json', {
                            method: 'GET',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json'
                            }
                        })
                        let lookerResponseData = await lookerResponse.json();
                        // console.log('lookerResponseData', lookerResponseData)
                        // console.log('lookerResponseData.queryResults', lookerResponseData.queryResults)
                        // console.log('lookerResponseData.queryResults.length', lookerResponseData.queryResults.length)
                        this.setState({
                            customDropdownOptions: lookerResponseData.queryResults
                        })
                    }
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
                    let lookerResponse = await fetch('/fetchfolder/' + usecaseContent[j].lookerContent[i].id, { //+ usecaseContent[j].type + '/'
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        }
                    })


                    let lookerResponseData = await lookerResponse.json();

                    let looksToUse = [...lookerResponseData.sharedFolder.looks, ...lookerResponseData.embeddedUserFolder.looks]
                    let dashboardsToUse = [...lookerResponseData.sharedFolder.dashboards]
                    let objToUse = {
                        looks: looksToUse,
                        dashboards: dashboardsToUse
                    }
                    // console.log('objToUse', objToUse)

                    this.setState({
                        reportBuilderContent: objToUse
                    }, () => {
                        console.log('setState callback ', this.state.reportBuilderContent)
                    })

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
                    let lookerResposnse = await fetch('/runquery/' + usecaseContent[j].lookerContent[i].id + '/' + usecaseContent[j].lookerContent[i].resultFormat, {
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
        // console.log('tabsArray', tabsArray);
        // console.log('contentArray', contentArray);

        //simulate tab change, when looker action taken...
        if (!$(tabsArray[tabIndex]).hasClass('active')) {
            for (let i = 0; i < tabsArray.length; i++) {
                if (i === tabIndex) {
                    tabsArray[i].className = "nav-link active "
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

    setActiveDemoComponent = (listIndex) => {
        // console.log('setActiveDemoComponent')
        // console.log('listIndex', listIndex)
        let listArray = $("#list-tab:visible a");
        let tabArray = $("#nav-tabContent:visible > div");
        // console.log('listArray', listArray)
        // console.log('tabArray', tabArray)

        if (!$(tabArray[listIndex]).hasClass('active')) {
            for (let i = 0; i < listArray.length; i++) {
                if (i === listIndex) {
                    listArray[i].className = "list-group-item list-group-item-action active"
                    tabArray[i].className = "tab-pane fade position-relative show active"
                } else {
                    listArray[i].className = "list-group-item list-group-item-action"
                    tabArray[i].className = "tab-pane position-relative fade"
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

    toggleMenu = (e) => {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    }

    render() {
        console.log('Content render')
        console.log('this.props', this.props)


        const { lookerContent, activeCustomization, lookerUser } = this.props
        const { pathname } = this.props.location
        const { renderSampleCode,
            sampleCode,
            renderModal,
            newLookerContent,
            newLookerContentErrorMessage,
            renderSideBar,
            splashPageContent,
            customDropdownOptions,
            reportBuilderContent } = this.state

        // let lookerUserCanExplore = lookerUser.permission_level === 'best' ? true : false;

        return (
            // <>
            //     <MainLayout activeCustomization={activeCustomization} usecaseContent={UsecaseContent} />
            // </>

            <h1>test</h1>

            // <div className="d-flex pt-5" id="wrapper">
            //     <div className="bg-light border-right" id="sidebar-wrapper">
            //         <div className="sidebar-heading">Navigation </div>

            //         <div className="list-group list-group-flush" id="list-tab" role="tablist">
            //             {
            //                 UsecaseContent.marketing.demoComponents.map((item, index) => {
            //                     return (
            //                         <a
            //                             id={validIdHelper(`list-${item.type}-list`)}
            //                             className={index === 0 ? "list-group-item list-group-item-action active" : "list-group-item list-group-item-action"}
            //                             data-toggle="pill"
            //                             href={validIdHelper(`#list-${item.type}`)}
            //                             role="tab"
            //                             aria-controls={validIdHelper(`#list-${item.type}`)}
            //                             aria-selected="true"
            //                             onClick={() => {
            //                                 this.setActiveDemoComponent(index);
            //                             }}>
            //                             {item.label}
            //                             <i className={`fas ${item.icon} ml-3`} />
            //                         </a>
            //                     )
            //                 })
            //             }
            //             {/* <SimpleList /> */}
            //         </div>
            //     </div>
            //     <div id="page-content-wrapper">


            //         {/* < Header
            //             onLogoutSuccess={this.props.applySession}
            //             companyName={activeCustomization.companyName || "WYSIWYG"} //default
            //             logoUrl={activeCustomization.logoUrl || "https://looker.com/assets/img/images/logos/looker_black.svg"} //default
            //             lookerUser={this.props.lookerUser}
            //             switchLookerUser={this.props.switchLookerUser}
            //             pathname={pathname}
            //             toggleMenu={this.toggleMenu}
            //         /> */}

            //         <div className="container-fluid">
            //             <div className="tab-content" id="nav-tabContent">
            //                 {
            //                     UsecaseContent.marketing.demoComponents.map((item, index) => {
            //                         // hack for dynamic component name
            //                         const Map = {
            //                             "splash page": SplashPage,
            //                             "custom filter": CustomFilter,
            //                             "dashboard overview detail": DashboardOverviewDetail,
            //                             "report builder": ReportBuilder,
            //                             "query builder": ComingSoon,
            //                             "custom viz": ComingSoon
            //                         }
            //                         const DemoComponent = Map[item.type];
            //                         return (
            //                             <div
            //                                 id={validIdHelper(`list-${item.type}`)}
            //                                 className={index === 0 ? "tab-pane fade position-relative show active" : "tab-pane fade position-relative"}
            //                                 role="tabpanel"
            //                                 aria-labelledby={validIdHelper(`list-${item.type}-list`)}>

            //                                 <DemoComponent key={validIdHelper(`list-${item.type}`)}
            //                                     lookerContent={item.lookerContent}
            //                                     setActiveTab={this.setActiveTab}
            //                                     setActiveDemoComponent={this.setActiveDemoComponent}
            //                                     dropdownSelect={this.dropdownSelect}
            //                                     splashPageContent={splashPageContent}
            //                                     demoComponentType={item.type}
            //                                     customDropdownOptions={customDropdownOptions}
            //                                     reportBuilderContent={reportBuilderContent}
            //                                 />

            //                                 {
            //                                     index > 0 ?
            //                                         <CodeSideBar
            //                                             renderSampleCode={renderSampleCode}
            //                                             sampleCode={sampleCode}
            //                                             lookerUser={lookerUser}
            //                                             toggleCodeBar={this.toggleCodeBar}
            //                                             demoComponentType={item.type} /> : ''
            //                                 }

            //                             </div>
            //                         )
            //                     })}
            //             </div>
            //         </div>
            //     </div >
            // </div >
        )
    }
}

export default Content;