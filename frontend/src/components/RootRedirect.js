import React, { useState } from 'react';
import { currentSession } from '../services/session-manager';
import GlitchHop from '../pages/GlitchHop/GlitchHop';
import Dashboard from '../pages/Dashboard/Dashboard';
import { Redirect } from 'react-router-dom';

export default function RootRedirect() {
    const [waitingJwtValidation, setWaitingJwtValidation] = useState(true);
    const [animationHasEnded, setAnimationHasEnded] = useState(false);
    const [jwtValid, setJwtValid] = useState(false);

    async function validateJWTSession() {

        console.log(currentSession.token);

        setJwtValid(await currentSession.isAuthenticated());
        setWaitingJwtValidation(false);
    }

    validateJWTSession();

    return (
        <React.Fragment>
        {

            waitingJwtValidation ? 'Validating session...':
            !jwtValid ? <Redirect to="/login"/> :
            !animationHasEnded ? <GlitchHop onEnded={()=>setAnimationHasEnded(true)}/> :
            <Dashboard/>
            
        }
        </React.Fragment>
    )
}