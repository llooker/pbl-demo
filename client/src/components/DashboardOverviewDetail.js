import React, { useState, useEffect } from 'react';

function DashboardOverviewDetail(props) {
    console.log('DashboardOverviewDetail')
    // const { lookerContent, setActiveTab, dropdownSelect } = props
    const { userProfile } = props;
    console.log('userProfile', userProfile)

    // alert(userProfile)

    return (
        <div className="home container-fluid p-5 position-relative">
            <div className="row pt-5">
                <h1>This is my DashboardOverviewDetail component</h1>
            </div>
        </div>
    )

}

export default DashboardOverviewDetail