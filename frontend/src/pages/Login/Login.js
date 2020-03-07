import React, {useState} from 'react';

import './Login.css';
import Avatar from '../../assets/avatar.png'
import Background from '../../assets/background.jpg';
import { sendLogin, setToken } from '../../services/api';


export default function Login() {
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');

    async function submitLogin(event) {
        console.log(1)
        event.preventDefault();
        let res = await sendLogin({email, password});
        console.log(res);
        if (res.status === 200) setToken(res.data.token);

        setEmail('');
        setPassword('');
    }

    return (
        <div className="row" style={{backgroundImage: Background}}>
            <div className="col-9 col-sm-6 col-md-5 col-lg-4 col-xl-3 mx-auto mt-5 border border-info">
                <div className="text-center mt-2">
                    <img className="img login-logo" alt="avatar" src={Avatar}/>
                </div>
                <form action="/" onSubmit={submitLogin}>
                    <div className="form-group text-center">
                        <input className="form-control mt-2" type="email" placeholder="E-mail" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                        <input className="form-control mt-2" type="password" placeholder="Senha" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                        <input className="btn btn-primary w-100 mt-4 " type="submit" value="Entrar"/>
                    </div>
                </form>
            </div>
        </div>
    );
}