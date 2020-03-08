import React from 'react';
import LoginForm from './Forms/LoginForm';
import RegisterForm from './Forms/RegisterForm';
import Avatar from '../../assets/avatar.png'

import './AbstractLoginRegister.css';

export default function AbstractLoginRegister(props) {
    return (
        <div className="row alr-page">
            <div className="col-9 col-sm-6 col-md-5 col-lg-4 col-xl-3 mx-auto mt-5 alr-panel"> 
                <div className="text-center mt-2">
                    <img className="img login-logo" alt="avatar" src={Avatar}/>
                </div>
                {
                    props.formType==="Login"? <LoginForm/>:
                    props.formType==="Register"? <RegisterForm/>:
                    'ERROR 500: wrong AbstractLoginRegister.formType'
                }
                </div>    
        </div>
    )   
}