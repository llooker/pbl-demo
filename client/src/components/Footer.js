import React from 'react';
import { Link } from 'react-router-dom'

function Footer(props) {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-bottom">
                <div className="ml-auto">
                    {props.pathname === "/customize" ? <Link to='/home'>
                        <i className="fas fa-home cursor" /></Link> : <Link to='/customize'>
                            <i className="fas fa-cog cursor" /></Link>}
                </div>
            </nav>
        </>
    );
}

export default Footer;