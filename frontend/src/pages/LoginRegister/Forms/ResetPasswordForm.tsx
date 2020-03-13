import React, { useState, FormEvent } from 'react';
import { sendResetPassword } from '../../../services/api';
import { useHistory } from 'react-router-dom';


export default function ResetPasswordForm(props: {token: string}) {
    const token = props.token;
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const history = useHistory();

    async function sendReset(event: FormEvent) {
        event.preventDefault();

        if (password1 !== password2) {
            alert('senhas não coincidem');
            return;
        }

        const safeResponse = await sendResetPassword({resetID: token, password:password1});
        if (safeResponse.type === 'Success')
            history.push('/login');
            
        //TODO: check if response is successful
    }

    return (
        <React.Fragment>
            <h4 className="text-center d-block mt-3">Redefinir Senha</h4>
            <form action="/" onSubmit={sendReset}>
                <div className="form-group text-center">
                    <input className="form-control mt-2" type="password" placeholder="Nova senha" value={password1} onChange={(e)=>setPassword1(e.target.value)} required/>
                    <input className="form-control mt-2" type="password" placeholder="Confirmar nova senha" value={password2} onChange={(e)=>setPassword2(e.target.value)} required/>
                    <input className="btn btn-primary w-100 mt-4 " type="submit" value="Enviar"/>
                </div>
            </form>
        </React.Fragment>
    );
}