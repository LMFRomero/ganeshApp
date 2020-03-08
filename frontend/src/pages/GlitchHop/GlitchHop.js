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


export default function GlitchHop(props) {
    setBackgroundBlack();

    return (
        <React.Fragment>
            <video className="embed-responsive embed-responsive-16by9" autoPlay id="myVideo" onEnded={()=>{restoreBackground(); props.onEnded();}}>
                <source src={ClipWelcome} type="video/mp4" />
            </video>
        </React.Fragment>
    );
}