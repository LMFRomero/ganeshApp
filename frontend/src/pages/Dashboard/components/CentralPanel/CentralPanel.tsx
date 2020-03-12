import React from 'react';
import MainFeed from '../MainFeed';

function retrieveComponentForTab(tab: string) {
    return (
        tab === 'Feed Geral' ? <MainFeed/> : 
        <h1>{tab}</h1>
    );
}

export default function CentralPanel(props: {currTab: string}) {
    return (
        <React.Fragment>
            {retrieveComponentForTab(props.currTab)}
        </React.Fragment>
    );
}