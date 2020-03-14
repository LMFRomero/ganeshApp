import React from 'react';
import { currentSession } from '../services/session-manager';
import GlitchHop from '../pages/GlitchHop/GlitchHop';
import Dashboard from '../pages/Dashboard/Dashboard';
import { Redirect, RouteComponentProps } from 'react-router-dom';

type RootRedirectState = {
    backendResponded: Boolean,
    sessionValid: Boolean
    animationEnded: Boolean
}

//This class is used to determine where the route '/' should go
export default class RootRedirect extends React.Component<{}, RootRedirectState>{
    animationTimeout: NodeJS.Timeout | null;
    constructor(props: RouteComponentProps) {
        super(props);

        //Ganesh welcome animation's timeout handler
        this.animationTimeout = null;

        //Initial conditions
        this.setState({
            backendResponded: false,
            sessionValid: false,
            animationEnded: false
        });
        
        //Starts a async task to validate currentSession.sessionID with backend
        this.validateSession();

        //Pass this to function's this
        this.validateSession.bind(this);
        this.render.bind(this);
    }

    async validateSession() {
        //Checks if there is a sessionID and if it's still valid from backend
        const sessionValid = await currentSession.isAuthenticated();

        //If not valid, session is useless
        if (!sessionValid) currentSession.destroyCookie();

        //Update state with validity of the session and backendResponded = true
        this.setState({
            sessionValid,
            backendResponded: true
        });

        //After 2 seconds, end welcome animation by timeout
        this.animationTimeout = setTimeout(()=> {
            this.setState({
                animationEnded: true
            })
        }, 2000);
    }

    componentWillUnmount() {
        //Before unmonting component, cancel animationTimeout handler. Problems with video getting stuck would appear otherwise
        if (this.animationTimeout)
            clearTimeout(this.animationTimeout);
        this.animationTimeout = null;
    }

    render() { 
        //Determines which component should be rendered based on current conditions
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