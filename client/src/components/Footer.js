import React from 'react';
import { Link } from 'react-router-dom'

function Footer(props) {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-bottom">
                <ul className="nav nav-pills ml-5 mr-5 w-100">
                    <li className="nav-item ">
                        <i className="fas fa-info cursor text-muted" />
                    </li>
                    <li className="nav-item ml-2">
                        <span className="font-weight-light text-muted">Looker host: {props.lookerHost}</span>
                    </li>

                    <li className="nav-item ml-auto">
                        {props.pathname === "/customize" ? <Link to='/home'>
                            <i className="fas fa-home cursor" /></Link> : <Link to='/customize'>
                                <i className="fas fa-cog cursor" /></Link>}
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default Footer;