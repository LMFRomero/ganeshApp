import React from 'react';

import './GlitchHop.css';

//@ts-ignore
import ClipWelcome from '../../assets/clip_welcome.mp4';

export default function GlitchHop() {
    return (
        <React.Fragment>
            <video className="embed-responsive embed-responsive-16by9" autoPlay muted={true} preload="none" id="myVideo">
                <source src={ClipWelcome} type="video/mp4" />
            </video>
        </React.Fragment>
    );
}