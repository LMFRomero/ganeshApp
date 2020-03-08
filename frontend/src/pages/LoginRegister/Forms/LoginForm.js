import React, {useState} from 'react';

import { sendLogin, setToken } from '../../../services/api';
import { useHistory, Link } from 'react-router-dom';
import { currentSession } from '../../../services/session-manager';

export default function LoginForm() {
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let history = useState(useHistory())[0];

    async function submitLogin(event) {
        console.log('Attempting login with backend...')
        event.preventDefault();
        let res = await sendLogin({email, password});
        setEmail('');
        setPassword('');
        
        console.log('Login Response:');
        console.log(res);

        if (res.status === 200)  {
            setToken(res.data.token);
            currentSession.token = res.data.token;
            console.log('Login was successful, redirecting to animation at /');
            history.push('/');
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
            <ul class="d-sm-flex nav justify-content-between mt-2 mt-sm-4 ml-n3 mr-n3 w-xl-50">
                <li class="nav-item text-left col-12 col-sm-5 p-0 m-0 pl-xl-2">
                    <Link class="nav-link active" to='/register'>Criar conta</Link>
                </li>
                <li class="nav-item text-left text-sm-right col-12 col-sm-7 p-0 m-0 pr-xl-2">
                    <Link class="nav-link disabled" to="/edacd">Esqueci a senha</Link>
                </li>
            </ul>
        </React.Fragment>
    );
}