import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import './Home.css';

function Header(props) {
  // console.log('props', props)
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <ul className="nav nav-pills ml-5 mr-5 w-100">
          <li className="nav-item ">
            <img id="logoUrlNav" src={props.logoUrl} />
          </li>
          <li className="nav-item ml-3">
            <a className="nav-link">{props.companyName}</a>
          </li>
          <li className="nav-item dropdown ml-auto ">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {/* Settings */}
              {props.lookerUser.permissionLevel.charAt(0).toUpperCase() + props.lookerUser.permissionLevel.substring(1)}
            </a>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
              {/* new */}
              {props.pathname === "/home" ? <UserOptions lookerUser={props.lookerUser} switchLookerUser={props.switchLookerUser} /> : ''}
              {/* end lookerUser functionality */}
              <a className="dropdown-item">
                <GoogleLogout
                  clientId={props.clientId}
                  buttonText={props.buttonText}
                  onLogoutSuccess={() => { props.onLogoutSuccess({}) }} //send blank object
                >
                </GoogleLogout>
              </a>
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
}

function UserOptions(props) {
  return (
    <>
      <h6 className="dropdown-header">Change Looker User</h6>
      {props.lookerUser.permissionLevel === "good" ? ' ' : <a className="dropdown-item" onClick={() => { props.switchLookerUser("good") }}>Good</a>}
      {props.lookerUser.permissionLevel === "better" ? ' ' : <a className="dropdown-item" onClick={() => { props.switchLookerUser("better") }}>Better</a>}
      {props.lookerUser.permissionLevel === "best" ? ' ' : <a className="dropdown-item" onClick={() => { props.switchLookerUser("best") }}>Best</a>}
      <div className="dropdown-divider"></div>
    </>
  )
}

export default Header;