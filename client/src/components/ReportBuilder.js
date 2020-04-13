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
    ]

    return (
        < div className="container" >
            <div className="row">
                <ul id="reportBuilderTabList" className="nav nav-tabs w-100 parentTabList" role="tablist">
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

                                                    <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                                        {
                                                            reportFilters.map((item, index) => {
                                                                return (
                                                                    <a className={index == 0 ? "nav-link active" : "nav-link "}
                                                                        id={validIdHelper(`v-pills-${item.name}-tab`)}
                                                                        data-toggle="pill"
                                                                        href={validIdHelper(`#v-pills-${item.name}`)}
                                                                        role="tab"
                                                                        aria-controls={validIdHelper(`#v-pills-${item.name}`)}
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