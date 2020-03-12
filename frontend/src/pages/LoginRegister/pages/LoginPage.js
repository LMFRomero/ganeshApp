import React from 'react';
import AbstractLoginRegister from '../AbstractLoginRegister';

export default function LoginPage(props) {
    return (
        <AbstractLoginRegister {...props} formType="Login"/>
    )
}