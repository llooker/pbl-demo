import React from 'react';
import { Link } from 'react-router-dom'

function Sidebar(props) {
    // console.log('Sidebar')
    // console.log('props', props)
    return (
        <div className="col-sm-2">
            <div className="list-group">
                <Link to='/home'><li href="#" className={props.pathname === "/home" ? "list-group-item active" : "list-group-item"}>Overview</li></Link>
                <Link to='/lookup'><li href="#" className={props.pathname === "/lookup" ? "list-group-item active" : "list-group-item"}>Lookup</li></Link>
                <Link to='/report'><li href="#" className={props.pathname === "/report" ? "list-group-item active" : "list-group-item"}>Report Builder</li></Link>
                <Link to='/explore'><li href="#" className={props.pathname === "/explore" ? "list-group-item active" : "list-group-item"}>Explore</li></Link>
            </div>
        </div>
    );
}

export default Sidebar;