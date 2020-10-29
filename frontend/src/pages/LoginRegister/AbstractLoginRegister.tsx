import React from 'react';
import LoginForm from './Forms/LoginForm';
import RegisterForm from './Forms/RegisterForm';
import Avatar from '../../assets/avatar.png'

import './AbstractLoginRegister.css';
import ForgotPasswordForm from './Forms/ForgotPasswordForm';
import ResetPasswordForm from './Forms/ResetPasswordForm';
import { RouteComponentProps, Link } from 'react-router-dom';

export type ALRProps = RouteComponentProps & {
    formType: string;
    match: {
        params: {
            token?: string;
        }
    }
};

export default function AbstractLoginRegister(props: RouteComponentProps & ALRProps) {
    return (
        <div className="row no-gutters alr-page">
            <div className="col-75 col-sm-50 col-md-40 col-lg-33 col-xl-25 mx-auto mt-5 alr-panel border border-info"> 
                <div className="text-center mt-2">
                    <Link to="/login"><img className="img login-logo" alt="avatar" src={Avatar}/></Link>
                </div>
                {
                    props.formType==="Login"? <LoginForm {...props}/>:
                    props.formType==="Register"? <RegisterForm {...props}/>:
                    props.formType==="ForgotPassword"? <ForgotPasswordForm {...props}/>:
                    props.formType==="ResetPassword"? <ResetPasswordForm token={props.match.params.token || ''}/>:
                    'ERROR 500: wrong AbstractLoginRegister.formType'
                }
                </div>    
        </div>
    )   
}