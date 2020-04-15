import React from 'react'
let { validIdHelper } = require('../tools');

function DashboardOverviewDetail(props) {
    // console.log('DashboardOverviewDetail')
    // console.log('props', props)
    // console.log('props.lookerContent', props.lookerContent)
    const { lookerContent, setActiveTab } = props
    return (
        <div className="pt-3 pl-3 position-relative">
            <div className="row">
                <ul className="nav nav-tabs w-100 parentTabList" id="dashboardOverviewDetailTabList" role="tablist">
                    {lookerContent.map((item, index) => {
                        return (
                            <li className="nav-item"
                                key={validIdHelper(item.id) + 'li'} >
                                <a key={validIdHelper(item.id) + 'a'}
                                    id={validIdHelper(`${item.id}-tab`)}
                                    className={index === 0 ? "nav-link active" : "nav-link"}
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
                <div className="tab-content w-100 parentTabContent" id="dashboardOverviewDetailTabContent">
                    {lookerContent.map((item, index) => {
                        return (
                            <div key={validIdHelper(item.id)}
                                className={index === 0 ? "tab-pane fade show active" : "tab-pane fade"}
                                id={validIdHelper(`${item.id}`)}
                                role="tabpanel"
                                aria-labelledby={validIdHelper(`${item.id}-tab`)}>
                                {item.customDropdown ?
                                    <div className="row pt-3">
                                        <div className="col-sm-3">
                                            <label htmlFor="modalForm">{item.customDropdown.label}</label>
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

export default DashboardOverviewDetail