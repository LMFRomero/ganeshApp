import React from 'react';
import { currentSession } from '../services/session-manager';
import GlitchHop from '../pages/GlitchHop/GlitchHop';
import Dashboard from '../pages/Dashboard/Dashboard';
import { Redirect } from 'react-router-dom';

type RootRedirectState = {
    backendResponded: Boolean,
    sessionValid: Boolean
    animationEnded: Boolean
}

export default class RootRedirect extends React.Component<{}, RootRedirectState>{
    timeout: NodeJS.Timeout | null;
    constructor() {
        super({backendResponded:Boolean});
        this.timeout = null;
        this.validateSession();
        this.setState({
            backendResponded: false,
            sessionValid: false,
            animationEnded: false
        });
        this.validateSession.bind(this);
        this.render.bind(this);
    }

    async validateSession() {
        const sessionValid = await currentSession.isAuthenticated();
        if (!sessionValid) currentSession.destroyCookie();
        this.setState({
            sessionValid,
            backendResponded: true
        });
        this.timeout = setTimeout(()=> {
            this.setState({
                animationEnded: true
            })
        }, 2000);
    }

    componentWillUnmount() {
        if (this.timeout)
            clearTimeout(this.timeout);
        this.timeout = null;
    }

    render() { 
        return (
            <React.Fragment>
                {
                    !this.state ? 'loading states' :
                    !this.state.backendResponded ? 'Validating session...':
                    !this.state.sessionValid ? <Redirect to="/login"/> :
                    !this.state.animationEnded ? <GlitchHop/> :
                    <Dashboard/>   
                }
            </React.Fragment>
        )
    }
}