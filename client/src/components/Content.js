import React from 'react';
import './Home.css';
import Modal from './Modal'

import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';



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
        LookerEmbedSDK.init('demo.looker.com', '/auth')
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
            if (lookerContent[i].type === 'dashboard') {
                LookerEmbedSDK.createDashboardWithId(lookerContent[i].id)
                    .appendTo(validIdHelper(`#embedContainer${lookerContent[i].id}`))
                    .withClassName('iframe')
                    .withNext()
                    .on('dashboard:run:start', (e) => {
                        // console.log('e', e)
                    })
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

    dropdownSelect = (e) => {
        // console.log('dropdownSelect')
        // console.log('e.target', e.target)
        const targetId = e.target.id
        const dashboardStateName = e.target.getAttribute("dashboardStateName")
        const dropdownFilterName = e.target.getAttribute("dropdownFilterName")
        this.setState({
            [targetId]: e.target.value
        }, () => {
            // console.log('dropdownSelect callback')
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
    setActiveTab = (e) => {
        // console.log('setActiveTab')
        // console.log('e', e)

        if (this.state.renderSampleCode) this.toggleCodeBar()

        const tabContentType = e.target.getAttribute("contentType");
        this.setState({
            activeTabType: tabContentType
        }, () => {
            const sampleCodeFilePath = require(`../sample-code/${tabContentType}.sample.txt`);
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


                <div className="row pt-5">
                    <ul className="nav nav-tabs w-100" id="myTab" role="tablist">
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
                                        contentType={item.type}
                                        onClick={(e) => this.setActiveTab(e)}>
                                        {item.name}
                                    </a>
                                </li>

                            )
                        })}
                        {activeCustomization.id !== 'defaultCustomization' ? < li className="nav-item"><i className="fas fa-plus cursor text-secondary" onClick={this.toggleModal} /></li>
                            : ''}
                        <li className="nav-item ml-auto"><i className="fas fa-code cursor text-secondary" onClick={this.toggleCodeBar} /></li>
                    </ul>
                </div>

                <div className="row">

                    <div className="tab-content w-100" id="myTabContent">

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
                                                    dropdownFilterName={item.customDropdown.filterName}
                                                    dashboardStateName={item.id}
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