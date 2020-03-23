import React, { useState, FormEvent } from 'react';

import './ForgotPasswordForm.css';

import {sendForgotPassword} from '../../../services/api';
import Modal, { showModal } from '../../../components/Modal';
import { AxiosError } from 'axios';
import AxiosErrorToast from 'src/components/Toast/AxiosErrorToast';

export default function ForgotPasswordForm(props: object) {
    const modalID = '#forgotPasswordModal';
    const [email, setEmail] = useState('marcuscastelo@usp.br');

    let connectionErrorToastRef = React.createRef<AxiosErrorToast>();

    function promptConfirmation(event: FormEvent) {
        event.preventDefault();
        showModal(modalID);
    }

    async function submitForgotPassword() {
        const safeResponse = await sendForgotPassword({email});
        if (safeResponse.type === 'Error') {
            const error = safeResponse.error as AxiosError;
            connectionErrorToastRef.current?.showAxiosError(error);
        }
    }

    return (
        <React.Fragment>
            <h4 className="text-center d-block mt-3">Esqueci minha senha</h4>
            <form action="/" onSubmit={promptConfirmation}>
                <div className="form-group text-center">
                    <input className="form-control mt-3" type="email" placeholder="E-mail" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                    <input className="btn btn-primary w-100 mt-4 " type="submit" value="Enviar"/>
                </div>
            </form>
            <Modal id="forgotPasswordModal"
                title="Confirmação de e-mail"
                body={(<React.Fragment>Se <span className="font-weight-bold text-info">{email}</span> for realmente seu e-mail, enviaremos as instruções de restauração de senha (cheque sua caixa de spam).
                <br/><br/> Deseja enviar para esse e-mail?</React.Fragment>)}
                footer={(<React.Fragment><button type="button" className="btn btn-secondary" data-dismiss="modal">Não</button>
                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={submitForgotPassword}>Sim, enviar</button></React.Fragment>)}
                />
            <AxiosErrorToast id="connectionErrorToast"
                title="Erro no envio de recuperação de senha"
                delay={2500}
                ref={connectionErrorToastRef}
            />
        </React.Fragment>
    )
}