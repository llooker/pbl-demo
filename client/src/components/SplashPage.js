import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import UsecaseContent from '../usecaseContent.json'
import './Home.css';
let { validIdHelper } = require('../tools');

function SplashPage(props) {
    console.log('SplashPage')
    console.log('props', props)


    const { lookerContent, setActiveDemoComponent, dropdownSelect, splashPageContent } = props

    // console.log('splashPageContent', splashPageContent)

    /*const { lookerContent, setActiveTab } = props
    const [activeFolder, setActiveFolder] = useState("all")

    const handleChange = (event) => {
        // console.log('handleChange');
        // console.log('event.target', event.target);
        // console.log('0000 activeFolder', activeFolder)
        setActiveFolder(event.target.name)
    }

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // console.log('useEffect')

        let iFrameArray = $(".embedContainer:visible iframe");

        for (let i = 0; i < iFrameArray.length; i++) {

            if (iFrameArray[i].classList.contains('shared')) {
                if (activeFolder === 'all' || activeFolder === 'shared') {
                    iFrameArray[i].className = 'iframe look shared'
                } else if (activeFolder === 'personal') {
                    iFrameArray[i].className = 'iframe look shared d-none'
                }
            } else if (iFrameArray[i].classList.contains('personal')) {
                if (activeFolder === 'all' || activeFolder === 'personal') {
                    iFrameArray[i].className = 'iframe look personal'
                } else if (activeFolder === 'personal') {
                    iFrameArray[i].className = 'iframe look personal d-none'
                }
            }
        }
    });

    let reportFilters = [
        { "label": "All", "name": "all" },
        { "label": "Personal", "name": "personal" },
        { "label": "Shared", "name": "shared" }
    ]*/

    return (
        <div className="pt-5 pl-5 position-relative">
            <div className="row">
                <h4>{UsecaseContent.marketing.demoComponents[0].title}</h4>
            </div>
            <div className="row text-center">
                {
                    splashPageContent.length ?
                        splashPageContent.map((item, index) => {
                            return (
                                <div key={index} className="card ml-5 p-3 mt-3 bg-light" style={{ "width": 18 + 'rem' }}>
                                    <div className="card-body">
                                        <h5 className="card-title">{UsecaseContent.marketing.demoComponents[0].lookerContent[index].label}:</h5>
                                        {/* <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                                        <p className="card-text">
                                            {/* {
                                                index === 0 ?
                                                    item.queryResults[0]['adevents.total_cost']
                                                    : index === 1 ?
                                                        item.queryResults.length
                                                        :
                                                        item.queryResults.reduce((a, cv) => { return a + Math.floor(cv['session_attribution.total_attribution']) }, 0).toLocaleString()

                                            } */}
                                            {
                                                UsecaseContent.marketing.demoComponents[0].lookerContent[index].desiredProperty
                                                    ?
                                                    (item.queryResults[0][UsecaseContent.marketing.demoComponents[0].lookerContent[index].desiredProperty]).toLocaleString()
                                                    : (item.queryResults[UsecaseContent.marketing.demoComponents[0].lookerContent[index].desiredMethod]).toLocaleString()
                                            }
                                        </p>
                                    </div>
                                </div>)

                        }) :
                        <div className="d-flex justify-content-center min-height-200 w-100 ">
                            <div className="spinner-border ml-auto mr-auto" role="status" aria-hidden="true">
                            </div>
                        </div>

                }
            </div>

            <div className="border-top my-5"></div>

            <div className="row">
                <h4>Take actions on your data: </h4>
            </div>
            <div className="row text-center">
                {
                    UsecaseContent.marketing.demoComponents.map((item, index) => {
                        // console.log('item', item)
                        return (
                            index > 0 ?
                                <div key={item.type} className="card ml-5 mt-5 p-3 bg-light" style={{ "width": 18 + 'rem' }}>
                                    <div className="card-body">
                                        <h5 className="card-title">{item.label}<i className={`fas ${item.icon} ml-3`} /></h5>
                                        <p className="card-text">{item.description}</p>
                                        <a className="btn btn-primary"
                                            href={`#v-pills-${validIdHelper(item.type)}`}
                                            role="button"
                                            onClick={() => setActiveDemoComponent(index)}>{item.label}</a>

                                    </div>
                                </div> : '')
                    })
                }
            </div>
        </div>
    )
}

export default SplashPage