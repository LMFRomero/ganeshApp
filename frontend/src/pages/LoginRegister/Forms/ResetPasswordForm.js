import React, { useState } from 'react';
import { sendResetPassword } from '../../../services/api';



export default function ResetPasswordForm({match}) {
    const token = match.params.token;
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    async function sendReset(event) {
        event.preventDefault();

        if (password1 !== password2) {
            alert('senhas não coincidem');
            return;
        }

        const response = await sendResetPassword(token, password1);
        //TODO: check if response is successful
    }

    return (
        <React.Fragment>
            <h4 className="text-center d-block mt-3">Login</h4>
            <form action="/" onSubmit={sendReset}>
                <div className="form-group text-center">
                    <input className="form-control mt-2" type="password" placeholder="Nova senha" value={password1} onChange={(e)=>setPassword1(e.target.value)} required/>
                    <input className="form-control mt-2" type="password" placeholder="Confirmar nova senha" value={password2} onChange={(e)=>setPassword2(e.target.value)} required/>
                    <input className="btn btn-primary w-100 mt-4 " type="submit" value="Entrar"/>
                </div>
            </form>
        </React.Fragment>
    );
}