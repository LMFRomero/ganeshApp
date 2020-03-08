import React from 'react';

import './Dashboard.css';
import FeedCard from '../../components/FeedCard/FeedCard';

import {sendLogout} from '../../services/api';

function generateCards() {

    let info = {
        titles: ['Reunião Geral'],
        subtitles: ['sala: 5-003', 'Venham com notebook'],
        texts: ['Pauta da reunião: XSS attack with bu...'],
        links: [{url:'/welcome', label:'testWelcome'}]
    };

    const generatedCards = [];
    for (let i = 0; i < 10; i++) generatedCards.push(<FeedCard {...info}/>)
    return generatedCards;
}

export default function Dashboard() {
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
                    <ul class="list-group w-100">
                        <button type="button" class="list-group-item list-group-item-action active">Cras justo odio</button>             
                        <button type="button" class="list-group-item list-group-item-action">Dapibus ac facilisis in</button>
                        <button type="button" class="list-group-item list-group-item-action">Morbi leo risus</button>
                        <button type="button" class="list-group-item list-group-item-action">Porta ac consectetur ac</button>
                        <button type="button" class="list-group-item list-group-item-action" disabled>Vestibulum at eros</button>
                    </ul>
                </div>
                {/* PAINEL CENTRAL */}
                <div className="col-9 col-md-8 dash-center-panel">
                    <div className="dash-feed mx-2 mx-md-5 mt-3">
                        {generateCards()}
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