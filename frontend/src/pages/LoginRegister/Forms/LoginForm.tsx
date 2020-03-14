import React, {useState} from 'react';

import { useHistory, Link } from 'react-router-dom';
import { currentSession } from '../../../services/session-manager';
import { AxiosError } from 'axios';

import AxiosErrorToast from 'src/components/Toast/AxiosErrorToast';

export default function LoginForm(props : object) {
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let history = useState(useHistory())[0];

    let errorToastRef = React.createRef<AxiosErrorToast>();

    async function submitLogin(event: React.FormEvent) {
        event.preventDefault();
        
        console.log('Attempting login with backend...')
        const response = await currentSession.authenticate(email, password);

        if (response.type === 'Success') {
            history.push('/');   
        } else {
            console.log('try to show toast')
            const error = response.error as AxiosError;
            errorToastRef.current?.showAxiosError(error);
        }
    }

    return (
        <React.Fragment>
            <h4 className="text-center d-block mt-3">Login</h4>
            <form action="/" onSubmit={submitLogin}>
                <div className="form-group text-center">
                    <input className="form-control mt-2" type="email" placeholder="E-mail" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                    <input className="form-control mt-2" type="password" placeholder="Senha" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                    <input className="btn btn-primary w-100 mt-4 " type="submit" value="Entrar"/>
                </div>
            </form>
            <ul className="d-sm-flex nav justify-content-between mt-2 mt-sm-4 ml-n3 mr-n3 w-xl-50">
                <li className="nav-item text-left col-12 col-sm-5 p-0 m-0 pl-xl-2">
                    <Link className="nav-link active" to='/register'>Criar conta</Link>
                </li>
                <li className="nav-item text-left text-sm-right col-12 col-sm-7 p-0 m-0 pr-xl-2">
                    <Link className="nav-link" to="/forgot-password">Esqueci a senha</Link>
                </li>
            </ul>
            <AxiosErrorToast 
                id="connectionError"
                title="Erro no login"
                delay={3000}
                ref={errorToastRef}
                />
        </React.Fragment>
    );
}