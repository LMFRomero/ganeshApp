import React from 'react';
import AbstractLoginRegister from '../AbstractLoginRegister';
import { RouteComponentProps } from 'react-router-dom';

export default function RegisterPage(props: RouteComponentProps) {
    return (
        <AbstractLoginRegister {...props} formType="Register"/>
    )
}