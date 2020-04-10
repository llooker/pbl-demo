import React, { useState, useEffect } from 'react';
import './Home.css';
import Modal from './Modal'

import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import $ from 'jquery';
import { parse } from 'querystring';

import SideBar from './SideBar'

// start of material
// import Button from '@material-ui/core/Button';
// import Box from '@material-ui/core/Box';
// import Container from '@material-ui/core/Container';
// import Typography from '@material-ui/core/Typography';
// import Link from '@material-ui/core/Link';

import DemoComponents from '../demoComponents.json';
import { render } from '@testing-library/react';

// console.log('DemoComponents', DemoComponents)


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
        console.log('LookerContent componentDidMount')
        // const { lookerContent } = this.props
        // this.setupLookerContent(lookerContent)
        // this.setupLookerContent(DemoComponents)

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
        console.log('LookerContent componentDidUpdate')
        if (this.props.lookerContent != undefined && this.props.lookerContent !== prevProps.lookerContent) {
            // this.setupLookerContent(this.props.lookerContent)
            console.log('inside this ifff')
            this.setupLookerContent(DemoComponents)
        }

        // if (this.props.lookerUser != undefined && this.props.lookerUser !== prevProps.lookerUser) {
        // LookerEmbedSDK.init(`${this.props.lookerHost}.looker.com`, '/auth')
        // }
    }



    async setupLookerContent(lookerContent) {
        console.log('setupLookerContent')
        // console.log('lookerContent', lookerContent)

        //delete old content..?
        let embedContainerArray = document.getElementsByClassName("embedContainer");
        // console.log('embedContainerArray', embedContainerArray)
        for (let h = 0; h < embedContainerArray.length; h++) {
            let thisEmbedContainerId = embedContainerArray[h].id
            document.getElementById(thisEmbedContainerId).innerHTML = ''
        }

        for (let j = 0; j < lookerContent.length; j++) {

            // console.log('lookerContent[j]', lookerContent[j])

            for (let i = 0; i < lookerContent[j].lookerContent.length; i++) {

                // console.log('lookerContent[j].lookerContent[i]', lookerContent[j].lookerContent[i])

                LookerEmbedSDK.createDashboardWithId
                if (lookerContent[j].lookerContent[i].type === 'dashboard') {
                    LookerEmbedSDK.createDashboardWithId(lookerContent[j].lookerContent[i].id)
                        .appendTo(validIdHelper(`#embedContainer${lookerContent[j].lookerContent[i].id}`))
                        .withClassName('iframe')
                        .withNext()
                        .withFilters() //new
                        .withTheme('Looker') //new
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
                                [lookerContent[j].lookerContent[i].id]: dashboard //5277
                            })
                            // this.changeHeight(dashboard, `embedContainer${lookerContent[i].id}`)
                        })
                        .catch((error) => {
                            console.error('Connection error', error)
                        })
                } else if (lookerContent[j].lookerContent[i].type === 'explore') {
                    LookerEmbedSDK.createExploreWithId(lookerContent[j].lookerContent[i].id)
                        .appendTo(validIdHelper(`#embedContainer${lookerContent[j].lookerContent[i].id}`))
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

                } else if (lookerContent[j].lookerContent[i].type === 'folder') {
                    let lookerResposnse = await fetch('/fetchfolder/' + lookerContent[j].lookerContent[i].id, { //+ lookerContent[j].type + '/'
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        }
                    })

                    // console.log('lookerResposnse', lookerResposnse)

                    let lookerResponseData = await lookerResposnse.json();
                    // console.log('lookerResponseData', lookerResponseData);

                    let looksToUse = [...lookerResponseData.sharedFolder.looks, ...lookerResponseData.embeddedUserFolder.looks]
                    // console.log('looksToUse', looksToUse)
                    let dashboardsToUse = [...lookerResponseData.sharedFolder.dashboards]
                    // console.log('dashboardsToUse', dashboardsToUse)

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
                                    .appendTo(validIdHelper(`#embedContainer${lookerContent[j].lookerContent[i].id}`))
                                    .withClassName('iframe')
                                    .withClassName('look')
                                    // .withClassName('d-none')
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
                            // console.log('item', item)
                            let dashboardId = item.id
                            LookerEmbedSDK.createDashboardWithId(dashboardId)
                                .appendTo(validIdHelper(`#embedContainer${lookerContent[j].lookerContent[i].id}`))
                                .withClassName('iframe')
                                .withClassName('dashboard')
                                // .withClassName('d-none')
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
        // console.log('dropdownSelect')
        // console.log('e.target', e.target)
        const targetId = e.target.id
        const dashboardStateName = e.target.getAttribute("dashboardstatename")
        const dropdownFilterName = e.target.getAttribute("dropdownfiltername")
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

    // think about this
    setActiveTab = (tabIndex) => {
        // console.log('setActiveTab')
        // console.log('tabIndex', tabIndex)

        if (this.state.renderSampleCode) this.toggleCodeBar();

        let tabsArray = $("#parentTabList:visible a");
        let contentArray = $("#parentTabContent:visible > div");

        console.log('tabsArray', tabsArray)
        console.log('contentArray', contentArray)

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
        // console.log('this.state.activeDemoComponent', this.state.activeDemoComponent)

        let objToUse = {
            type: newLookerContent.type.value,
            id: newLookerContent.id.value,
            name: newLookerContent.name.value
        }
        // console.log('objToUse', objToUse)

        if (objToUse.type && objToUse.id && objToUse.name) {
            // console.log('inside iffff')
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
        console.log('drillClick')
        console.log('event', event)
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


            // console.log('parsedUrl', parsedUrl)
            // console.log('url', url)
            // console.log('000 stateName', stateName)
            // console.log('filterName', filterName)
            // console.log('filterValue', filterValue)
            if (stateName === 'pwSkck3zvGd1fnhCO7Fc12') stateName = 3106; // hack for now...
            //urls changed to relative, need slugs to work across instances?
            // console.log('111 stateName', stateName)

            this.state[stateName].updateFilters({ [filterName]: filterValue })
            this.state[stateName].run()

            this.setActiveTab(1)

            return { cancel: (isCampaignPerformanceDrill) ? true : false }
        }
    }

    //async 
    filtersUpdates(event) {
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
    }


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
                            {
                                DemoComponents.map((item, index) => {
                                    return (
                                        <a className={index == 0 ? "nav-link active" : "nav-link "}
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
                                                    console.log('onClick callback activeDemoComponent', this.state.activeDemoComponent)
                                                    setTimeout(() => { this.setActiveTab(0) }, 1000)
                                                })
                                            }}>
                                            {item.type.charAt(0).toUpperCase() + item.type.substring(1)}
                                        </a>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="col-sm-10">
                        <div className="tab-content" id="v-pills-tabContent">
                            {
                                DemoComponents.map((item, index) => {
                                    // hack for dynamic component name
                                    const Map = {
                                        "dashboard overview detail": DashboardOverviewDetail,
                                        "report builder": ReportBuilder,
                                    }
                                    const DemoComponent = Map[item.type];
                                    return (
                                        <div className={index == 0 ? "tab-pane fade show active" : "tab-pane fade"}
                                            id={validIdHelper(`v-pills-${item.type}`)}
                                            role="tabpanel"
                                            aria-labelledby={validIdHelper(`v-pills-${item.type}-tab`)}>

                                            <DemoComponent key={validIdHelper(`v-pills-${item.type}`)}
                                                lookerContent={item.lookerContent}
                                                setActiveTab={this.setActiveTab}
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


                                        </div>
                                    )
                                })}
                            {/* move to here so only renders once.. */}
                            <CodeSideBar
                                renderSampleCode={renderSampleCode}
                                sampleCode={sampleCode}
                                lookerUser={lookerUser}
                                toggleCodeBar={this.toggleCodeBar} />
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default Content;

function validIdHelper(str) {
    // console.log('validIdHelper')
    // console.log('str', str)
    //need to replace special characters that may be associated with id...
    return str.replace(/[^a-zA-Z0-9-.#]/g, "")
}

function DashboardOverviewDetail(props) {
    // console.log('DashboardOverviewDetail')
    // console.log('props', props)
    // console.log('props.lookerContent', props.lookerContent)
    const { lookerContent, setActiveTab } = props
    return (
        <div className="container">
            <div className="row">
                <ul id="parentTabList" className="nav nav-tabs w-100" role="tablist">
                    {lookerContent.map((item, index) => {
                        return (
                            <li className="nav-item" key={validIdHelper(item.id)} >
                                <a key={validIdHelper(item.id)}
                                    // className={index === 0 ? "nav-link active show" : item.type !== 'explore' ? "nav-link" : lookerUserCanExplore ? "nav-link" : "nav-link sudo-disabled"}
                                    className={index === 0 ? "nav-link active show" : "nav-link"}
                                    id={validIdHelper(`${item.id}-tab`)}
                                    data-toggle="tab"
                                    href={validIdHelper(`#${item.id}`)}
                                    role="tab"
                                    aria-controls={validIdHelper(`${item.id}`)}
                                    aria-selected="true"
                                    contenttype={item.type}
                                    onClick={() => setActiveTab(index)}>
                                    {item.name}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <div className="row">
                <div className="tab-content w-100" id="parentTabContent">
                    {lookerContent.map((item, index) => {
                        return (
                            <div key={validIdHelper(item.id)} className={index === 0 ? "tab-pane fade show active" : "tab-pane fade"} id={validIdHelper(`${item.id}`)} role="tabpanel" aria-labelledby={validIdHelper(`${item.id}-tab`)}>
                                {item.customDropdown ?
                                    <div className="row pt-3">
                                        <div className="col-sm-3">
                                            <label htmlFor="modalForm">{item.customDropdown.title}</label>
                                            <select
                                                id={`dropdownSelect${item.id}`}
                                                className="form-control"
                                                onChange={(e) => this.dropdownSelect(e)}
                                                type="select-one"
                                                dropdownfiltername={item.customDropdown.filterName}
                                                dashboardstatename={item.id}
                                            >
                                                {item.customDropdown.options.map(item => {
                                                    return <option
                                                        key={item == null ? 'Any' : item}
                                                        value={item == null ? 'Any' : item}
                                                    > {item == null ? 'Any' : item}</option>
                                                })}
                                            </select>
                                        </div>
                                    </div> :
                                    ''}
                                <div className="row pt-3">
                                    <div id={validIdHelper(`embedContainer${item.id}`)} className="col-sm-12 embedContainer"></div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div >
    )
}

function ReportBuilder(props) {
    console.log('ReportBuilder')

    const { lookerContent, setActiveTab } = props

    const checkboxes = [
        {
            name: 'sharedCheckBox',
            key: 'sharedCheckBox',
            label: 'Shared',
        },
        {
            name: 'personalCheckBox',
            key: 'personalCheckBox',
            label: 'Personal',
        }
    ]
    let checkBoxObj = {}
    checkboxes.map(item => checkBoxObj[item.name] = true)

    const [checkedItems, setCheckedItems] = useState(checkBoxObj)

    const handleChange = (event) => {
        // console.log('handleChange');
        // console.log('event.target', event.target);
        setCheckedItems({ ...checkedItems, [event.target.name]: event.target.checked });
    }

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        let iFrameArray = $(".embedContainer:visible iframe");

        for (let i = 0; i < iFrameArray.length; i++) {
            if ($(iFrameArray[i]).hasClass('shared')) {
                if (checkedItems.sharedCheckBox) {
                    iFrameArray[i].className = "iframe look shared"
                } else {
                    iFrameArray[i].className = "iframe look shared d-none"

                }
            } else if ($(iFrameArray[i]).hasClass('personal')) {
                if (checkedItems.personalCheckBox) {
                    iFrameArray[i].className = "iframe look personal"
                } else {
                    iFrameArray[i].className = "iframe look personal d-none"
                }
            }
        }
    });

    return (
        < div className="container" >
            <div className="row">
                <ul id="parentTabList" className="nav nav-tabs w-100" role="tablist">
                    {lookerContent.map((item, index) => {
                        return (
                            <li className="nav-item">
                                <a key={validIdHelper(item.id)}
                                    className={index === 0 ? "nav-link active show" : "nav-link"}
                                    id={validIdHelper(`${item.id}-tab`)}
                                    data-toggle="tab"
                                    href={validIdHelper(`#${item.id}`)}
                                    role="tab"
                                    aria-controls={validIdHelper(`${item.id}`)}
                                    aria-selected="true"
                                    contenttype={item.type}
                                    onClick={() => setActiveTab(index)}>
                                    {item.name}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <div className="row">
                <div className="tab-content w-100" id="parentTabContent">
                    {lookerContent.map((item, index) => {
                        return (
                            <div key={validIdHelper(item.id)} className={index === 0 ? "tab-pane fade show active" : "tab-pane fade"} id={validIdHelper(`${item.id}`)} role="tabpanel" aria-labelledby={validIdHelper(`${item.id}-tab`)}>
                                {item.customDropdown ?
                                    <div className="row pt-3">
                                        <div className="col-sm-3">
                                            <label htmlFor="modalForm">{item.customDropdown.title}</label>
                                            <select
                                                id={`dropdownSelect${item.id}`}
                                                className="form-control"
                                                onChange={(e) => this.dropdownSelect(e)}
                                                type="select-one"
                                                dropdownfiltername={item.customDropdown.filterName}
                                                dashboardstatename={item.id}
                                            >
                                                {item.customDropdown.options.map(item => {
                                                    return <option
                                                        key={item == null ? 'Any' : item}
                                                        value={item == null ? 'Any' : item}
                                                    > {item == null ? 'Any' : item}</option>
                                                })}
                                            </select>
                                        </div>
                                    </div> :
                                    ''}
                                <div className="row pt-3">
                                    {
                                        index === 0 ?
                                            <>
                                                <div className="col-sm-4">
                                                    <h6>View content from specific folders:</h6>
                                                    {checkboxes.map((item, index) => {
                                                        return (
                                                            <div className="form-check">
                                                                <input name={item.name}
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    value={checkedItems[item.name]}
                                                                    checked={checkedItems[item.name]}
                                                                    onChange={handleChange} />
                                                                <label key={item.key}
                                                                    className="form-check-label"
                                                                    htmlFor={item.name} > {item.label}</label>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <div id={validIdHelper(`embedContainer${item.id}`)} className="col-sm-8 embedContainer"></div>
                                            </> :
                                            <>
                                                <h6>Explore data and create new reports</h6>
                                                <div id={validIdHelper(`embedContainer${item.id}`)} className="col-sm-12 embedContainer"></div>
                                            </>
                                    }

                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div >
    )
}

function CodeSideBar(props) {
    // console.log('CodeSideBar');
    // console.log('props', props);
    const { renderSampleCode, sampleCode, lookerUser, toggleCodeBar } = props

    return (
        renderSampleCode ?
            <ReactCSSTransitionGroup
                transitionName="slide"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}>
                < div className="col-sm-8 position-absolute right-abs top-abs--20 p-3 bg-light rounded" >


                    <ul className="nav nav-tabs" id={`nestedTab`} role="tablist">

                        <li className="nav-item">
                            <a className="nav-link active show"
                                id={`sample-code-tab`}
                                data-toggle="tab"
                                href={`#sample-code`}
                                role="tab"
                                aria-controls={`sample-code`}
                                aria-selected="true"
                            >Sample Code</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link"
                                id={`user-properties-tab`}
                                data-toggle="tab"
                                href={`#user-properties`}
                                role="tab"
                                aria-controls={`user-properties`}
                                aria-selected="true"
                            >User Properties</a>
                        </li>

                        <button
                            type="button"
                            className="close ml-auto mr-2"
                            data-dismiss="modal"
                            aria-label="Close"
                            onClick={toggleCodeBar}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </ul>
                    <div className="tab-content" id={`nestedContent`}>
                        <div className="tab-pane fade show active" id={`sample-code`} role="tabpanel" aria-labelledby={`sample-code-tab`}>

                            <SyntaxHighlighter language="javascript" style={docco} showLineNumbers={true} >
                                {sampleCode}
                            </SyntaxHighlighter>
                        </div>

                        <div className="tab-pane fade" id={`user-properties`} role="tabpanel" aria-labelledby={`user-properties-tab`}>

                            <SyntaxHighlighter language="json" style={docco} showLineNumbers={true} >
                                {JSON.stringify(lookerUser, true, 4)}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                </div >
            </ReactCSSTransitionGroup >
            : <li className="nav-item ml-auto list-unstyled right-abs top-abs-0 abs"><i className="fas fa-code cursor text-secondary" onClick={toggleCodeBar} /></li>
    )
}
