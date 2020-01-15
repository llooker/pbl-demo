import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

function Navbar(props) {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <ul className="nav nav-pills w-100">
          <li className="nav-item">
            {props.companyname}
          </li>
          <li className="nav-item dropdown ml-auto">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Settings
            </a>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
              {/* commented out for now */}
              {/* <a className="dropdown-item" href="#">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                  <label class="form-check-label" for="defaultCheck1">
                    Default checkbox
                  </label>
                </div>
              </a> */}
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

export default Navbar;