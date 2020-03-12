import React from 'react';

import './GlitchHop.css';

import ClipWelcome from '../../assets/clip_welcome.mp4';

let styleBKP;
function setBackgroundBlack() {
    styleBKP = document.body.style;
    document.body.style = 'background: black !important;';
}

function restoreBackground() {
    document.body.style = styleBKP;
}

let hasEnded = false;
export default function GlitchHop(props) {
    function onEnded() {
        if (hasEnded) return;
        hasEnded = true;
        restoreBackground();
        if (props.onEnded)
            props.onEnded();
    }

    setBackgroundBlack();
    
    setTimeout(onEnded, 2100);

    return (
        <React.Fragment>
            <video className="embed-responsive embed-responsive-16by9" autoPlay muted="muted" preload="none" id="myVideo">
                <source src={ClipWelcome} type="video/mp4" />
            </video>
        </React.Fragment>
    );
}