import React, { useState, useEffect } from 'react';
import $ from 'jquery';
let { validIdHelper } = require('../tools');

function ReportBuilder(props) {
    // console.log('ReportBuilder')

    const { lookerContent, setActiveTab } = props
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

            //if activeFolder is all, show all
            if (activeFolder === 'all') {
                if (iFrameArray[i].classList.contains('d-none')) iFrameArray[i].classList.remove('d-none')
            } else if (activeFolder === 'shared') {//if activeFolder is shared, hide personal, show shared
                if (iFrameArray[i].classList.contains('personal')) iFrameArray[i].className = 'iframe look personal d-none'
                else if (iFrameArray[i].classList.contains('shared')) iFrameArray[i].classList.remove('d-none')
            } else if (activeFolder === 'personal') {//if activeFolder is shared, hide shared, show personal
                if (iFrameArray[i].classList.contains('shared')) iFrameArray[i].className = 'iframe look shared d-none'
                else if (iFrameArray[i].classList.contains('personal')) iFrameArray[i].classList.remove('d-none')
            }
        }
    });

    let reportFilters = [
        { "label": "All", "name": "all" },
        { "label": "Personal", "name": "personal" },
        { "label": "Shared", "name": "shared" }
    ]

    return (
        <div className="pt-3 pl-3">
            <div className="row">
                <ul id="reportBuilderTabList" className="nav nav-tabs w-100 parentTabList" role="tablist">
                    {lookerContent.map((item, index) => {
                        return (
                            <li className="nav-item">
                                <a key={validIdHelper(item.id)}
                                    className={index === 0 ? "nav-link active" : "nav-link"}
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
                <div className="tab-content w-100 parentTabContent" id="reportBuilderTabContent">
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
                                                <div className="col-sm-2">
                                                    <h6>Filter content from folders:</h6>

                                                    <div className="list-group list-group-flush" id="list-tab" role="tablist">
                                                        {
                                                            reportFilters.map((item, index) => {
                                                                return (
                                                                    <a key={validIdHelper(`list-${item.name}-list`)}
                                                                        className={index == 0 ?
                                                                            "list-group-item list-group-item-action list-group-item-light active" :
                                                                            "list-group-item list-group-item-action list-group-item-light"}
                                                                        id={validIdHelper(`list-${item.name}-list`)}
                                                                        data-toggle="pill"
                                                                        href={validIdHelper(`#list-${item.name}`)}
                                                                        role="tab"
                                                                        aria-controls={validIdHelper(`#list-${item.name}`)}
                                                                        aria-selected="true"
                                                                        onClick={handleChange}
                                                                        name={item.name}>
                                                                        {item.label}
                                                                        {/* {index === 0 ? <i class="fas fa-folder-open ml-2"></i> : ''} */}
                                                                    </a>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                <div id={validIdHelper(`embedContainer${item.id}`)} className="col-sm-10 embedContainer"></div>
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

export default ReportBuilder