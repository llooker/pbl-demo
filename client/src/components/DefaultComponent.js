import React, { useState, useEffect } from 'react';
import $ from 'jquery';
let { validIdHelper } = require('../tools');

function DefaultComponent(props) {
    // console.log('ReportBuilder')

    const handleChange = (event) => {
    }

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // console.log('useEffect')
    });

    return (
        <div className="pt-5 pl-5 position-relative">
            <div className="row">
                <h1>{props.demoComponentType} Component coming soon!</h1>
            </div>
        </div >
    )
}

export default DefaultComponent