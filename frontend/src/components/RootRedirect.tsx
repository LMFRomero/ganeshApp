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

export default class RootRedirect extends React.Component<{}, RootRedirectState>{
    animationTimeout?: NodeJS.Timeout;
    constructor(props: RouteComponentProps) {
        super(props);
        this.state = {
            backendResponded: false,
            sessionValid: false,
            animationEnded: false
        };


        this.validateSession.bind(this);
        this.render.bind(this);
    }

    componentDidMount() {
        this.validateSession();
    }
    
    async validateSession() {
        const safeRes = await sendValidate();
        const sessionValid = safeRes.type === 'Success';

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
        clearTimeout(this.animationTimeout as NodeJS.Timeout);
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