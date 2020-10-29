import React, { useState } from 'react';

import './Dashboard.css';

import {sendLogout} from '../../services/api';

import LeftNav from './components/LeftNav/LeftNav';
import CentralPanel from './components/CentralPanel/CentralPanel';
import { Link, useHistory } from 'react-router-dom';

export default function Dashboard() {
    const [currentTab, setcurrentTab] = useState('Feed Geral');

    let history = useHistory();

    function onLeftNavChange(event: React.MouseEvent<Element, MouseEvent>, text: string) {
        setcurrentTab(text);
    }

    function logout() {
        sendLogout();
        history.push('/login');
    }

    return (
        <React.Fragment>
            <div className="row no-gutters dash-box">
                {/* PAINEL ESQUERDO */}
                <div className="col-3 col-md-4 p-0 dash-left-panel">
                    <LeftNav onChange={onLeftNavChange}/>
                </div>
                {/* PAINEL CENTRAL */}
                <div className="col-9 col-md-8 dash-center-panel">
                    <div className="dash-feed mx-2 mx-md-5 mt-3">
                        <CentralPanel currTab={currentTab}/>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}   