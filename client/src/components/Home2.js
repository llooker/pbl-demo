import React, { useState, useEffect, useContext } from 'react';
import './Home.css';
import AppContext from '../contexts/AppContext';


import {
  useHistory,
} from "react-router-dom";

import { endSession } from '../AuthUtils/auth';

export default function Home(props) {

  let history = useHistory();
  let { setClientSession } = useContext(AppContext)

  return (
    <>
      <h1>analytics</h1>
      <button onClick={() => {
        setClientSession({})
        history.push("/")
        endSession();
      }}>Logout</button>
    </>
  )
}
