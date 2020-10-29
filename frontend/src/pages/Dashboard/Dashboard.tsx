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
            <div className="row no-gutters dash-nav">
                <div className="col-100">
                    <nav className="navbar navbar-expand-lg ">
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Marucs
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <Link className="dropdown-item" to="/">Perfil</Link>
                                <Link className="dropdown-item" to="/">Configurações</Link>
                                <Link className="dropdown-item" to="/logout">Desconectar</Link>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
            <div className="row no-gutters dash-box">
                {/* PAINEL ESQUERDO */}
                <div className="d-none d-md-flex col-16 p-0 dash-left-panel">
                    <LeftNav onChange={onLeftNavChange}/>
                </div>
                {/* PAINEL CENTRAL */}
                <div className="col-60 col-md-68 dash-center-panel">
                    <div className="dash-feed mx-2 mx-md-5 mt-3">
                        <CentralPanel currTab={currentTab}/>
                    </div>
                </div>
                {/* PAINEL DIREITO */}
                <div className="col-40 col-md-16 dash-right-panel">
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
        </React.Fragment>
    )
}   