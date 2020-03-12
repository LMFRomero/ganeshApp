import React, { useState, useEffect } from 'react';
import { currentSession } from '../services/session-manager';
import GlitchHop from '../pages/GlitchHop/GlitchHop';
import Dashboard from '../pages/Dashboard/Dashboard';
import { Redirect } from 'react-router-dom';

export default function RootRedirect() {
    const [finishedValidation, setFinishedValidation] = useState(false);
    const [animationHasEnded, setAnimationHasEnded] = useState(false);
    const [valid, setValid] = useState(false);

    async function validateSession() {
        const isValid = await currentSession.isAuthenticated();
        setValid(isValid); //Will change on next render
        console.log(finishedValidation, animationHasEnded, isValid)
        if (!isValid) currentSession.destroyCookie();
        setFinishedValidation(true);
    }

    useEffect(() => {
        validateSession();
        // eslint-disable-next-line
    }, []);

    return (
        <React.Fragment>
        {
            !finishedValidation ? 'Validating session...':
            !valid ? <Redirect to="/login"/> :
            !animationHasEnded ? <GlitchHop onEnded={()=>setAnimationHasEnded(true)}/> :
            <Dashboard/>   
        }
        </React.Fragment>
    )
}