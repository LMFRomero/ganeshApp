import React, { useState } from 'react';

import './GlitchHop.css';

import ClipWelcome from '../../assets/clip_welcome.gif';

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
            <img className="img-fluid d-block mx-auto clip-welcome" src={ClipWelcome} alt='loading'/>
            {/* <video className="embed-responsive embed-responsive-16by9" autoPlay muted id="myVideo">
                <source src={ClipWelcome} type="video/mp4" />
            </video> */}
        </React.Fragment>
    );
}