import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import DemoComponents from '../demoComponents.json';

function SplashPage(props) {
    console.log('SplashPage')
    console.log('props', props)

    const [activeUsecase, setActiveUsecase] = useState("marketing")

    const handleDropdownChange = (event) => {
        console.log('handleChange');
        setActiveUsecase(event.target.value)
    }

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        console.log('useEffect')
        console.log('activeUsecase', activeUsecase)

        console.log('DemoComponents[activeUsecase]', DemoComponents[activeUsecase])
    });

    return (
        <div className="home container-fluid p-5 position-relative">
            <div className="row pt-5">
                <div className="col-sm-3">
                    <label htmlFor="modalForm">Select industry to demo</label>
                    <select
                        id="industryDropdown"
                        className="form-control"
                        onChange={handleDropdownChange}
                        type="select-one"
                    >
                        {Object.keys(DemoComponents).map((key, value) => {
                            return <option
                                key={key}
                                value={key}
                            > {key.charAt(0).toUpperCase() + key.substring(1)}</option>
                        })}
                    </select>
                </div>
            </div>

            <div className="row pt-5">
                <div className="col-sm-3">
                    <h3>{DemoComponents[activeUsecase].splashPage.title}</h3>
                </div>
            </div>
            <div className="row pt-3">
                {/* {DemoComponents[activeIndustry].demoComponents.map(item => {
                    return (
                        <div key={item.type} className="card ml-5 p-3" style={{ "width": 18 + 'rem' }}>


                            <div className="card-body">
                                <h5 className="card-title">{item.type.charAt(0).toUpperCase() + item.type.substring(1)}<i className={`fas ${item.iconClass} ml-3`} /></h5>
                                <p className="card-text">{item.description}</p>

                                <Link to={`/${encodeURIComponent(item.type)}/${activeIndustry}`}>
                                    <button type="button" className="btn btn-primary ">{item.type.charAt(0).toUpperCase() + item.type.substring(1)}</button>
                                </Link>
                            </div>
                        </div>
                    )
                })} */}
                {
                    Object.keys(DemoComponents[activeUsecase].demoComponents).map(key => {
                        let thisDemoComponent = DemoComponents[activeUsecase].demoComponents[key];
                        return (
                            <div key={key} className="card ml-5 p-3" style={{ "width": 18 + 'rem' }}>


                                <div className="card-body">
                                    <h5 className="card-title">{thisDemoComponent.label}<i className={`fas ${thisDemoComponent.iconClass} ml-3`} /></h5>
                                    <p className="card-text">{thisDemoComponent.description}</p>

                                    <Link to={`/${activeUsecase}/${key}`}>
                                        <button type="button" className="btn btn-primary ">{thisDemoComponent.label}</button>
                                    </Link>
                                </div>
                            </div>

                        )
                    })
                }
            </div>
        </div >
    )
}

export default SplashPage;