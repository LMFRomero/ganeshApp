import React from 'react';
import MainFeed from '../MainFeed';

function retrieveComponentForTab(tab) {
    return (
        tab === 'Feed Geral' ? <MainFeed/> : 
        <h1>{tab}</h1>
    );
}

export default function CentralPanel(props) {
    return (
        <React.Fragment>
            {retrieveComponentForTab(props.currTab)}
        </React.Fragment>
    );
}