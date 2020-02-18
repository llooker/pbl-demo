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
        console.log('LookerContent componentDidMount')
        console.log('this.props.lookerContent', this.props.lookerContent)
        const { lookerContent } = this.props
        this.setupLookerContent(lookerContent)

    }

    async setupLookerContent(lookerContent) {
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

    render() {
        console.log('LookerContent render')
        const { lookerContent } = this.props
        return (

            <div className="home container p-5 position-relative">


                <div className="row pt-5">
                    <ul className="nav nav-tabs w-100" id="myTab" role="tablist">
                        {lookerContent.map((item, index) => {
                            return (
                                <li className="nav-item">
                                    <a key={validIdHelper(item.id)} className={index === 0 ? "nav-link active show" : "nav-link"} id={validIdHelper(`${item.id}-tab`)} data-toggle="tab" href={validIdHelper(`#${item.id}`)} role="tab" aria-controls={validIdHelper(`${item.id}`)} aria-selected="true">{item.name} </a>
                                </li>

                            )
                        })}
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
                                    </div>
                                </div>

                            )
                        })}
                    </div>
                </div>

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