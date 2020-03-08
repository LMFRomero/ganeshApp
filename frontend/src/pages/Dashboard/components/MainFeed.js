import React from 'react';
import FeedCard from '../../../components/FeedCard/FeedCard';


import uniqid from 'uniqid';

function generateCards() {

    let info = {
        titles: ['Reunião Geral'],
        subtitles: ['sala: 5-003', 'Venham com notebook'],
        texts: ['Pauta da reunião: XSS attack with bu...'],
        links: [{url:'/welcome', label:'testWelcome'}]
    };

    const generatedCards = [];
    for (let i = 0; i < 10; i++) generatedCards.push(<FeedCard key={uniqid('feedcard-')}{...info}/>)
    return generatedCards;
}


export default function MainFeed() {
    return (
        <React.Fragment>
            {generateCards()}
        </React.Fragment>
    );
}