import React from 'react';
import { Link } from 'react-router-dom';

function expandTitles(titles) {
    if (!titles || titles.length === 0) return '';
    let htmlComponents = titles.map((title) =>
        <h5 class="card-title">{title}</h5>
    );
    return htmlComponents;
}

function expandSubtitles(subtitles) {
    if (!subtitles || subtitles.length === 0) return '';
    let htmlComponents = subtitles.map((subtitle) =>
        <h6 class="card-subtitle mb-2 text-muted">{subtitle}</h6>
    );
    return htmlComponents;
}

function expandTexts(texts) {
    if (!texts || texts.length === 0) return '';
    let htmlComponents = texts.map((text) =>
        <p class="card-text">{text}</p>
    );
    return htmlComponents;

}

//links = [{label, url}]
function expandLinks(links) {
    if (!links || links.length === 0) return '';
    let htmlComponents = links.map((link) =>
        <Link to={link.url} class="card-link">{link.label}</Link>
    );
    return htmlComponents;
}

export default function FeedCard(props) {
    return (
        <div class="card w-100 mt-2" style={{width: '18rem'}}>
            <div class="card-body">
                {expandTitles(props.titles)}
                {expandSubtitles(props.subtitles)}
                {expandTexts(props.texts)}
                {expandLinks(props.links)}
            </div>
        </div>
    );
}