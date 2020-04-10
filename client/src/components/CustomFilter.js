import React, { useState, useEffect } from 'react';
import DemoComponents from '../demoComponents.json';

function CustomFilters(props) {

    console.log('CustomFilters')
    console.log('props', props)
    console.log('DemoComponents', DemoComponents)

    const { pathname } = props.location

    let usecase = pathname.substring(pathname.indexOf('/') + 1, pathname.lastIndexOf('/'))
    let demoComponent = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length)

    console.log('usecase', usecase)
    console.log('demoComponent', demoComponent)
    console.log('DemoComponents[usecase]["demoComponents"][demoComponent]', DemoComponents[usecase]['demoComponents'][demoComponent])

    // let industry = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length)
    // console.log('industry', industry)

    // // console.log('DemoComponents[industry]', DemoComponents[industry])
    // let demoComponents = DemoComponents[industry].demoComponents;
    // console.log('demoComponents', demoComponents)


    // // const { lookerContent, setActiveTab, dropdownSelect } = props
    // const { userProfile } = props;
    // console.log('userProfile', userProfile)

    // alert(userProfile)

    return (
        <div className="home container-fluid p-5 position-relative">
            <div className="row pt-5">
                <h1>This is my CustomFilter component</h1>
            </div>
        </div>
    )

}

export default CustomFilters