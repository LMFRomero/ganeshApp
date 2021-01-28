import React from 'react';
import AbstractLoginRegister, { ALRProps } from '../AbstractLoginRegister';

export default function ForgotPasswordPage(props: ALRProps) {
    return (
        <AbstractLoginRegister {...props} formType="ForgotPassword"/>
    )
}