import React from 'react';
import { Link } from 'react-router-dom'

function Navigation(props) {
    console.log('Navigation')
    console.log('props', props)
    return (
        //as sidebar
        // <div className="col-sm-2">
        //     <div className="list-group">
        //         <Link to='/home'><li href="#" className={props.pathname === "/home" ? "list-group-item active" : "list-group-item"}>Overview</li></Link>
        //         <Link to='/lookup'><li href="#" className={props.pathname === "/lookup" ? "list-group-item active" : "list-group-item"}>Lookup</li></Link>
        //         <Link to='/report'><li href="#" className={props.pathname === "/report" ? "list-group-item active" : "list-group-item"}>Report Builder</li></Link>
        //         <Link to='/explore'><li href="#" className={props.pathname === "/explore" ? "list-group-item active" : "list-group-item"}>Explore</li></Link>
        //     </div>
        // </div>

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
                <li className="nav-item ml-auto"><i className="fas fa-code cursor text-secondary" onClick={props.toggleCodeBar ? props.toggleCodeBar : ''} /></li>

            </ul>
        </div>
    );
}

export default Navigation;