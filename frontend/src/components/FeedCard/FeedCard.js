import React from 'react';
import { Link } from 'react-router-dom';

import uniqid from "uniqid";


function expandTitles(titles) {
    if (!titles || titles.length === 0) return '';
    let htmlComponents = titles.map((title) =>
        <h5 className="card-title" key={uniqid('cardtitle-')}>{title}</h5>
    );
    return htmlComponents;
}

function expandSubtitles(subtitles) {
    if (!subtitles || subtitles.length === 0) return '';
    let htmlComponents = subtitles.map((subtitle) =>
        <h6 className="card-subtitle mb-2 text-muted" key={uniqid('cardsubtitle-')}>{subtitle}</h6>
    );
    return htmlComponents;
}

function expandTexts(texts) {
    if (!texts || texts.length === 0) return '';
    let htmlComponents = texts.map((text) =>
        <p className="card-text" key={uniqid('cardtext-')}>{text}</p>
    );
    return htmlComponents;

}

//links = [{label, url}]
function expandLinks(links) {
    if (!links || links.length === 0) return '';
    let htmlComponents = links.map((link) =>
        <Link to={link.url} className="card-link" key={uniqid('cardlink-')}>{link.label}</Link>
    );
    return htmlComponents;
}

export default function FeedCard(props) {
    return (
        <div className="card w-100 mt-2" style={{width: '18rem'}}>
            <div className="card-body">
                {expandTitles(props.titles)}
                {expandSubtitles(props.subtitles)}
                {expandTexts(props.texts)}
                {expandLinks(props.links)}
            </div>
        </div>
    );
}