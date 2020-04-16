import React, { useState, useEffect } from 'react';
import $ from 'jquery';
let { validIdHelper } = require('../../tools');

function ComingSoon(props) {
    // console.log('ReportBuilder')

    const handleChange = (event) => {
    }

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // console.log('useEffect')
    });

    return (
        <div className="pt-3 pl-3 position-relative">
            <div className="row">
                <h1>{props.demoComponentType} Component coming soon!</h1>
            </div>
        </div >
    )
}

export default ComingSoon