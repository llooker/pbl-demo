import React from 'react';
import Navigation from './Navigation'
import './Home.css';
import Modal from './Modal'

import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';



LookerEmbedSDK.init('demo.looker.com', '/auth')


class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // attributionDropdownValue: '',
            // genderDropdownValue: '',
            // attributionDropdownOptions: [],
            // genderDropdownOptions: [],
            // dashboard: '',
            renderSampleCode: false,
            sampleCode: {},
            activeTabType: 'dashboard', //forhome,
            renderModal: false,
            //set to desired empty object onload
            newLookerContent: {
                type: {
                    value: '',
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
        }
    }


    componentDidMount() {
        console.log('LookerContent componentDidMount')
        console.log('this.props.lookerContent', this.props.lookerContent)
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

    // componentDidUpdate() {
    //     console.log('LookerContent componentDidUpdate')
    //     console.log('this.props.lookerContent', this.props.lookerContent)
    //     const { lookerContent } = this.props
    // }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        console.log('LookerContent componentDidUpdate')
        if (this.props.lookerContent != undefined && this.props.lookerContent !== prevProps.lookerContent) {
            console.log('inside iffff')
            this.setupLookerContent(this.props.lookerContent)
        }
    }

    async setupLookerContent(lookerContent) {
        console.log('setupLookerContent')
        console.log('lookerContent', lookerContent)
        for (let i = 0; i < lookerContent.length; i++) {
            console.log('lookerContent[i]', lookerContent[i])
            if (lookerContent[i].type === 'dashboard') {
                console.log('if dashboard')
                LookerEmbedSDK.createDashboardWithId(lookerContent[i].id)
                    .appendTo(validIdHelper(`#embedContainer${lookerContent[i].id}`))
                    .withClassName('iframe')
                    .withNext()
                    .on('dashboard:run:start', (e) => { console.log(e) })
                    // .on('dashboard:filters:changed', (e) => this.filtersUpdates(e))
                    .build()
                    .connect()
                    .then((dashboard) => {
                        // this.setState(prevState => ({
                        //     lookerContent: [...prevState.lookerContent, dashboard]
                        // }))
                        this.setState({
                            [lookerContent[i].id]: dashboard //5277
                        },
                            () => {
                                console.log('createDashboardWithId callback')
                                console.log(this.state[lookerContent[i].id])
                            })
                    })
                    .catch((error) => {
                        console.error('Connection error', error)
                    })
            } else if (lookerContent[i].type === 'explore') {
                console.log('else if explore')
                console.log((validIdHelper(`#embedContainer${lookerContent[i].id}`)))
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
                console.log('else if folder')

                let lookerResposnse = await fetch('/fetchfolder/' + lookerContent[i].id, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                })

                let lookerResposnseData = await lookerResposnse.json();
                // console.log('lookerResposnseData', lookerResposnseData)
                lookerResposnseData.folder.looks.map((item, index) => {
                    console.log('item', item)
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

    setActiveTab = (e) => {

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
        console.log('toggleModal')
        this.setState(prevState => ({
            renderModal: prevState.renderModal ? false : true
        }), () => {
            console.log('toggleModal callback this.state.renderModal', this.state.renderModal)
        })
    }

    handleModalFormChange = (e) => {
        console.log('handleModalFormChange')
        console.log('e.target.dataset.key', e.target.dataset.key)
        let objCopy = { ...this.state.newLookerContent }
        console.log('000 objCopy', objCopy)
        objCopy[e.target.dataset.key] = {
            value: e.target.value,
            type: e.target.type
        }

        console.log('111 objCopy', objCopy)
        this.setState({
            renderModal: true,
            newLookerContent: objCopy
        })
    }

    render() {
        console.log('LookerContent render')
        const { lookerContent } = this.props
        const { renderSampleCode } = this.state
        const { sampleCode } = this.state
        const { renderModal } = this.state
        const { newLookerContent } = this.state
        console.log('lookerContent', lookerContent)
        console.log('renderModal', renderModal)
        return (

            <div className="home container p-5 position-relative">


                <div className="row pt-5">
                    <ul className="nav nav-tabs w-100" id="myTab" role="tablist">
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
                                        contentType={item.type}
                                        onClick={(e) => this.setActiveTab(e)}>
                                        {item.name}
                                    </a>
                                </li>

                            )
                        })}
                        <li className="nav-item"><i className="fas fa-plus cursor text-secondary" onClick={this.toggleModal} /></li>
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
                                                    // value={this.state['genderDropdownValue']}
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
                                        <div id={validIdHelper(`embedContainer${item.id}`)} className="col-sm-12">

                                        </div>

                                        <ReactCSSTransitionGroup
                                            transitionName="slide"
                                            transitionAppear={true}
                                            transitionAppearTimeout={500}
                                            transitionEnterTimeout={500}
                                            transitionLeaveTimeout={500}>
                                            {renderSampleCode ?
                                                <div className="col-sm-8 position-absolute right-abs top-abs p-3 bg-light rounded">
                                                    <h4>Sample code:</h4>
                                                    <SyntaxHighlighter language="javascript" style={docco} showLineNumbers={true} >
                                                        {sampleCode}
                                                    </SyntaxHighlighter>
                                                </div>
                                                : ''}
                                        </ReactCSSTransitionGroup>
                                    </div>
                                </div>

                            )
                        })}
                    </div>
                </div>


                {renderModal ?
                    <Modal title="Select Looker Content to Add" toggleModal={this.toggleModal} objForModal={newLookerContent} handleModalFormChange={this.handleModalFormChange} updateAction={this.props.updateLookerContent} />
                    : ''}

            </div>
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