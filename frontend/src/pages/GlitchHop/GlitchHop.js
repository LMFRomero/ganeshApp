import React from 'react';
import { useHistory } from "react-router-dom";


import './GlitchHop.css';

import ClipWelcome from '../../assets/clip_welcome.mp4';


export default function GlitchHop() {
    
    let history = useHistory();

    return (
        <React.Fragment>
            <video autoPlay id="myVideo" onEnded={()=>history.push('/')}>
                <source src={ClipWelcome} type="video/mp4" />
            </video>
        </React.Fragment>
    );
}