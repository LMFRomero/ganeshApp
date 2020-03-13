import React, { useState, FormEvent } from 'react';

import './ForgotPasswordForm.css';

import {sendForgotPassword} from '../../../services/api';
import Modal, { showModal } from '../../../components/Modal';

export default function ForgotPasswordForm(props: object) {
    const modalID = '#forgotPasswordModal';
    const [email, setEmail] = useState('marcuscastelo@usp.br');

    function promptConfirmation(event: FormEvent) {
        event.preventDefault();
        showModal(modalID);
    }

    async function submitForgotPassword() {
        await sendForgotPassword({email});
    }

    // setTimeout(()=>$("#forgotPasswordModal").modal(),500);
    

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
        </React.Fragment>
    )
}