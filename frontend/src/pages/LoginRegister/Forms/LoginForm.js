import React, {useState} from 'react';

import { useHistory, Link } from 'react-router-dom';
import { currentSession } from '../../../services/session-manager';

export default function LoginForm() {
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let history = useState(useHistory())[0];


    async function submitLogin(event) {
        //Inhibits default <form> action
        event.preventDefault();
        
        console.log('Attempting login with backend...')
        await currentSession.authenticate(email, password)

        setEmail('');
        setPassword('');
        
        console.log('hassession: ',currentSession.hasSession(), currentSession.getSessionID())
            if (currentSession.hasSession())  {
                history.push('/');
                console.log('Login was successful, redirecting to animation at /');
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
                    <Link className="nav-link disabled" to="/edacd">Esqueci a senha</Link>
                </li>
            </ul>
        </React.Fragment>
    );
}