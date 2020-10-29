import React from 'react';
import GlitchHop from '../pages/GlitchHop/GlitchHop';
import Dashboard from '../pages/Dashboard/Dashboard';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { sendValidate } from 'src/services/api';

type RootRedirectState = {
    backendResponded: Boolean,
    sessionValid: Boolean
    animationEnded: Boolean
}

//This class is used to determine where the route '/' should go
export default class RootRedirect extends React.Component<{}, RootRedirectState>{
    animationTimeout?: NodeJS.Timeout;
    constructor(props: RouteComponentProps) {
        super(props);

        //Initial conditions
        this.state = {
            backendResponded: false,
            sessionValid: false,
            animationEnded: false
        };


        this.validateSession.bind(this);
        this.render.bind(this);
    }

    componentDidMount() {
        //Starts a async task to validate currentSession.sessionID with backend
        this.validateSession();
    }
    
    async validateSession() {
        //Checks if there is a sessionID and if it's still valid from backend
        const safeRes = await sendValidate();
        const sessionValid = safeRes.type === 'Success';

        //Update state with validity of the session and backendResponded = true
        this.setState({
            sessionValid,
            backendResponded: true
        });
        
        if (sessionValid) {       
            this.animationTimeout = setTimeout(()=> {
                this.setState({
                    animationEnded: true
                })
            }, 2000, []);
        }
    }


    componentWillUnmount() {
        //Before unmonting component, cancel animationTimeout handler. Problems with video getting stuck would appear otherwise
        clearTimeout(this.animationTimeout as NodeJS.Timeout);
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