import React from 'react';
import { Link } from 'react-router-dom'

function Navigation(props) {
    return (
        <div className="row pt-5">

            <ul className="nav nav-tabs w-100">
                <li className="nav-item">
                    <Link className={props.pathname === "/home" ? "nav-link active" : "nav-link"} to='/home'>Overview</Link>
                </li>
                <li className="nav-item">
                    <Link className={props.pathname === "/lookup" ? "nav-link active" : "nav-link"} to='/lookup'>Lookup</Link>
                </li>
                <li className="nav-item">
                    <Link className={props.pathname === "/report" ? "nav-link active" : "nav-link"} to='/report'>Report Builder</Link>
                </li>
                <li className="nav-item">
                    <Link className={props.pathname === "/explore" ? "nav-link active" : "nav-link"} to='/explore'>Explore</Link>
                </li>
                <li className="nav-item"><i className="fas fa-plus cursor text-secondary" onClick={props.toggleModal} /></li>
                <li className="nav-item ml-auto"><i className="fas fa-code cursor text-secondary" onClick={props.toggleCodeBar ? props.toggleCodeBar : ''} /></li>

            </ul>
        </div>
    );
}

export default Navigation;