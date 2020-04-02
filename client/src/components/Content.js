import React from 'react';
import './Home.css';
import Modal from './Modal'

import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import $ from 'jquery';
// import Button from '@material-ui/core/Button';




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
            newLookerContentErrorMessage: ''
        }
    }


    componentDidMount() {
        console.log('LookerContent componentDidMount')
        const { lookerContent } = this.props
        this.setupLookerContent(lookerContent)

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
    }

    componentDidUpdate(prevProps) {
        // console.log('LookerContent componentDidUpdate')
        if (this.props.lookerContent != undefined && this.props.lookerContent !== prevProps.lookerContent) {
            this.setupLookerContent(this.props.lookerContent)
        }

        // if (this.props.lookerUser != undefined && this.props.lookerUser !== prevProps.lookerUser) {
        LookerEmbedSDK.init(`${this.props.lookerHost}.looker.com`, '/auth')
        // }
    }



    async setupLookerContent(lookerContent) {
        // console.log('setupLookerContent')
        // console.log('lookerContent', lookerContent)

        //delete old content..?
        let embedContainerArray = document.getElementsByClassName("embedContainer");
        for (let h = 0; h < embedContainerArray.length; h++) {
            let thisEmbedContainerId = embedContainerArray[h].id
            document.getElementById(thisEmbedContainerId).innerHTML = ''
        }

        for (let i = 0; i < lookerContent.length; i++) {

            LookerEmbedSDK.createDashboardWithId
            if (lookerContent[i].type === 'dashboard') {
                LookerEmbedSDK.createDashboardWithId(lookerContent[i].id)
                    .appendTo(validIdHelper(`#embedContainer${lookerContent[i].id}`))
                    .withClassName('iframe')
                    .withNext()
                    .on('dashboard:run:start', (e) => {
                        // console.log('e', e)
                    })
                    .on('drillmenu:click', (e) => this.drillClick(e))
                    .on('dashboard:filters:changed', this.filtersUpdates)
                    // .on('dashboard:filters:changed', (e) => this.filtersUpdates(e))
                    // .on('page:properties:changed', (e) => {
                    //     this.changeHeight(e, `embedContainer${lookerContent[i].id}`)
                    // })
                    .build()
                    .connect()
                    .then((dashboard) => {
                        this.setState({
                            [lookerContent[i].id]: dashboard //5277
                        })
                        // this.changeHeight(dashboard, `embedContainer${lookerContent[i].id}`)
                    })
                    .catch((error) => {
                        console.error('Connection error', error)
                    })
            } else if (lookerContent[i].type === 'explore') {
                LookerEmbedSDK.createExploreWithId(lookerContent[i].id)
                    .appendTo(validIdHelper(`#embedContainer${lookerContent[i].id}`))
                    .withClassName('iframe')
                    .build()
                    .connect()
                    .then(this.setupExplore)
                    .catch((error) => {
                        console.error('Connection error', error)
                    })

            } else if (lookerContent[i].type === 'folder') {
                let lookerResposnse = await fetch('/fetchfolder/' + lookerContent[i].id, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                })

                let lookerResposnseData = await lookerResposnse.json();
                lookerResposnseData.folder.looks.map((item, index) => {
                    let lookId = item.id
                    LookerEmbedSDK.createLookWithId(lookId)
                        .appendTo(validIdHelper(`#embedContainer${lookerContent[i].id}`))
                        .withClassName('iframe')
                        .build()
                        .connect()
                        .then(this.setupLook)
                        .catch((error) => {
                            console.error('Connection error', error)
                        })
                })
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
        // console.log('dashboardStateName', dashboardStateName)
        // console.log('dropdownFilterName', dropdownFilterName)
        this.setState({
            [targetId]: e.target.value
        }, () => {
            // console.log('dropdownSelect callback')
            // console.log('this.state[dashboardStateName]', this.state[dashboardStateName])
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

        let tabsArray = $("#parentTabList a");
        let contentArray = $("#parentTabContent > div");

        //simulate tab change, for looker action taken...
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
                this.props.saveLookerContent(objToUse)
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
        console.log('changeHeight')
        // console.log('event', event)
        // console.log('containerId', containerId)
        const div = document.getElementById(containerId)
        if (event && event.height && div) {
            div.style.height = `${event.height + 20}px`
        }
    }

    //async 
    filtersUpdates(event) {
        // loadingIcon(true);
        console.log('filtersUpdates')
        console.log('event', event)
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

    drillClick(event) {
        console.log('drillClick')
        console.log('event', event)
        console.log('this', this)

        // og
        // if (event && event.modal) {
        //     const dashboard_div = document.getElementById('dashboard')
        //     if (dashboard_div && dashboard_div.children.length > 1 && dashboard_div.lastChild) {
        //         dashboard_div.lastChild.remove()
        //     }
        //     LookerEmbedSDK
        //         .createExploreWithUrl(`https://${looker_host}${event.url}`)
        //         .appendTo('#dashboard')
        //         .withClassName('looker-embed')
        //         .build()
        //         .connect()
        //         .then()
        //         .catch((error: Error) => {
        //             console.error('Connection error', error)
        //         })
        //     return { cancel: true }
        // } else {
        //     return { cancel: false }
        // }

        //from slack w/ Bryan
        const isCampaignPerformanceDrill = (event.label === 'Campaign Performance Dashboard') ? true : false
        if (isCampaignPerformanceDrill) {

            console.log("inside ifff");
            // const new_url = new URL(event.url)
            // console.log('new_url', new_url)
            // let new_filters = JSON.parse(JSON.stringify(db_filters))
            // new_filters[334]['Contract IDs'] = new_url.searchParams.get('Contract IDs')
            // new_filters[334]['Months'] = new_url.searchParams.get('Months')
            // console.log(new_url.searchParams.get('Months'))
            // setDbFilters(new_filters)
            // setTab(2);

            this.setActiveTab(1) //working
        }
        return { cancel: (isCampaignPerformanceDrill) ? true : false }
    }


    render() {
        // console.log('Content render')
        // console.log('this.props.lookerUser', this.props.lookerUser)
        const { lookerContent } = this.props
        const { renderSampleCode } = this.state
        const { sampleCode } = this.state
        const { renderModal } = this.state
        const { newLookerContent } = this.state
        const { activeCustomization } = this.props
        const { newLookerContentErrorMessage } = this.state
        let { lookerUser } = this.props
        let { location } = window;
        // console.log('location', location)

        let lookerUserCanExplore = lookerUser.permission_level === 'best' ? true : false;
        // console.log('lookerUserCanExplore', lookerUserCanExplore)
        return (

            <div className="home container-fluid p-5 position-relative">


                {/* <Button variant="contained" color="primary">
                    Hello World
                </Button> */}


                <div className="row pt-5">
                    <ul id="parentTabList" className="nav nav-tabs w-100" role="tablist">
                        {lookerContent.map((item, index) => {
                            // console.log('item', item)
                            return (
                                <li className="nav-item">
                                    <a key={validIdHelper(item.id)}
                                        className={index === 0 ? "nav-link active show" : item.type !== 'explore' ? "nav-link" : lookerUserCanExplore ? "nav-link" : "nav-link sudo-disabled"}
                                        id={validIdHelper(`${item.id}-tab`)}
                                        data-toggle="tab"
                                        href={validIdHelper(`#${item.id}`)}
                                        role="tab"
                                        aria-controls={validIdHelper(`${item.id}`)}
                                        aria-selected="true"
                                        contenttype={item.type}
                                        onClick={() => this.setActiveTab(index)}>
                                        {item.name}
                                    </a>
                                </li>

                            )
                        })}
                        {/* {activeCustomization.id !== 'defaultCustomization' ? < li className="nav-item"><i className="fas fa-plus cursor text-secondary" onClick={this.toggleModal} /></li>
                            : ''} */}
                        <li className="nav-item"><i className="fas fa-plus cursor text-secondary" onClick={this.toggleModal} /></li>
                        <li className="nav-item ml-auto"><i className="fas fa-code cursor text-secondary" onClick={this.toggleCodeBar} /></li>
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
                                        <div id={validIdHelper(`embedContainer${item.id}`)} className="col-sm-12 embedContainer">

                                        </div>

                                        <ReactCSSTransitionGroup
                                            transitionName="slide"
                                            transitionAppear={true}
                                            transitionAppearTimeout={500}
                                            transitionEnterTimeout={500}
                                            transitionLeaveTimeout={500}>
                                            {renderSampleCode ?
                                                <div className="col-sm-8 position-absolute right-abs top-abs p-3 bg-light rounded">


                                                    <ul className="nav nav-tabs" id={`nestedTab${index}`} role="tablist">

                                                        <li className="nav-item">
                                                            <a className="nav-link active show"
                                                                id={`sample-code-tab-${index}`}
                                                                data-toggle="tab"
                                                                href={`#sample-code-${index}`}
                                                                role="tab"
                                                                aria-controls={`sample-code-${index}`}
                                                                aria-selected="true"
                                                            >Sample Code</a>
                                                        </li>
                                                        <li className="nav-item">
                                                            <a className="nav-link"
                                                                id={`user-properties-tab-${index}`}
                                                                data-toggle="tab"
                                                                href={`#user-properties-${index}`}
                                                                role="tab"
                                                                aria-controls={`user-properties-${index}`}
                                                                aria-selected="true"
                                                            >User Properties</a>
                                                        </li>

                                                        <button
                                                            type="button"
                                                            className="close ml-auto mr-2"
                                                            data-dismiss="modal"
                                                            aria-label="Close"
                                                            onClick={this.toggleCodeBar}
                                                        >
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </ul>
                                                    <div className="tab-content" id={`nestedContent${index}`}>
                                                        <div className="tab-pane fade show active" id={`sample-code-${index}`} role="tabpanel" aria-labelledby={`sample-code-tab-${index}`}>

                                                            <SyntaxHighlighter language="javascript" style={docco} showLineNumbers={true} >
                                                                {sampleCode}
                                                            </SyntaxHighlighter>
                                                        </div>

                                                        <div className="tab-pane fade" id={`user-properties-${index}`} role="tabpanel" aria-labelledby={`user-properties-tab-${index}`}>

                                                            <SyntaxHighlighter language="json" style={docco} showLineNumbers={true} >
                                                                {JSON.stringify(lookerUser, true, 4)}
                                                            </SyntaxHighlighter>
                                                        </div>
                                                    </div>
                                                </div>
                                                : ''}
                                        </ReactCSSTransitionGroup>
                                    </div>
                                </div>

                            )
                        })}
                    </div>
                </div>


                {
                    renderModal ?
                        <Modal title="Select Looker Content to Add"
                            toggleModal={this.toggleModal}
                            objForModal={newLookerContent}
                            handleModalFormChange={this.handleModalFormChange}
                            validateAction={this.validateLookerContent}
                            newLookerContentErrorMessage={newLookerContentErrorMessage} />
                        : ''
                }

            </div >
        )
    }
}


export default Content;

function validIdHelper(str) {
    // console.log('validIdHelper')
    // console.log('str', str)
    //need to replace special characters that may be associated with id...
    return str.replace(/[^a-zA-Z0-9-.# ]/g, "")
}

// function jump(h) {
//     console.log('jump')
//     console.log('h', h)
//     var url = location.href;               //Save down the URL without hash.
//     console.log('url', url)
//     location.href = "#" + h;                 //Go to the target element.
//     // history.replaceState(null, null, url);   //Don't like hashes. Changing it back.
//     // console.log('url', url)
// }