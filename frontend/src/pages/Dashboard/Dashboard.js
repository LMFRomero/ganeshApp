import React, { useState } from 'react';

import './Dashboard.css';

import {sendLogout} from '../../services/api';

import LeftNav from './components/LeftNav/LeftNav';
import CentralPanel from './components/CentralPanel/CentralPanel';

export default function Dashboard() {
    const [currentTab, setcurrentTab] = useState('Feed Geral');


    function onLeftNavChange(event, text) {
        setcurrentTab(text);
    }

    return (
        <React.Fragment>
            <div className="row dash-nav">
                <div className="col-12">
                    <nav className="navbar navbar-expand-lg ">

                    </nav>
                </div>
            </div>
            <div className="row dash-box">
                {/* PAINEL ESQUERDO */}
                <div className="d-none d-md-flex col-2 p-0 dash-left-panel">
                    <LeftNav onChange={onLeftNavChange}/>
                </div>
                {/* PAINEL CENTRAL */}
                <div className="col-9 col-md-8 dash-center-panel">
                    <div className="dash-feed mx-2 mx-md-5 mt-3">
                        <CentralPanel currTab={currentTab}/>
                    </div>
                </div>
                {/* PAINEL DIREITO */}
                <div className="col-3 col-md-2 dash-right-panel">
                    <button onClick={sendLogout}>Logout</button>
                </div>
            </div>
        </React.Fragment>
    )
}   