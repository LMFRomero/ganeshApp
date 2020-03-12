import React from 'react';
import AbstractLoginRegister from '../AbstractLoginRegister';

export default function RegisterPage(props) {
    return (
        <AbstractLoginRegister {...props} formType="Register"/>
    )
}