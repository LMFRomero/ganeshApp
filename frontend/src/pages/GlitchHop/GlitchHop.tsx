import React from 'react';

import './GlitchHop.css';

//@ts-ignore
import ClipWelcome from '../../assets/clip_welcome.mp4';

let styleBKP: CSSStyleDeclaration;
function setBackgroundBlack() {
    styleBKP = document.body.style;
    document.body.style.setProperty('background', 'black','important');
}

function restoreBackground() {
    //@ts-ignore
    document.body.style = styleBKP;
}

let hasEnded = false;
export default function GlitchHop(props: {onEnded: ()=>void}) {
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
            <video className="embed-responsive embed-responsive-16by9" autoPlay muted={true} preload="none" id="myVideo">
                <source src={ClipWelcome} type="video/mp4" />
            </video>
        </React.Fragment>
    );
}