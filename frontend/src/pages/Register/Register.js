import React, {useState} from 'react';

import './Register.css';
import Avatar from '../../assets/avatar.png'
import { sendRegister } from '../../services/api';

let ykey = 2020;
function generateLast20Years() {
    let currYear = new Date().getFullYear();
    let options = [];
    for(let i = currYear; i > currYear-20; i--)
        options.push(<option key={ykey++}>{i}</option>);
    return options;
}

export default function Register() {
    let [name, setName] = useState('');
    let [username, setUsername] = useState('');
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [NUSP, setNUSP] = useState('');
    let [anoIngressoUSP, setAnoIngressoUSP] = useState('');
    let [anoIngressoGanesh, setAnoIngressoGanesh] = useState('');

    async function submitRegister(event) {
        event.preventDefault();
        let res = await sendRegister({name, username, email, password, NUSP, anoIngressoUSP, anoIngressoGanesh});
        console.log(res);

        setName('');
        setUsername('')
        setEmail('');
        setPassword('');
        setNUSP('');
        setAnoIngressoUSP('');
        setAnoIngressoGanesh('');
    }

    return (
        <div className="row">
        <div className="col-9 col-sm-6 col-md-5 col-lg-4 col-xl-3 mx-auto mt-5 border border-info">
                <div className="text-center mt-2">
                    <img className="img login-logo" alt="avatar" src={Avatar}/>
                </div>
                <form action="/" onSubmit={submitRegister}>
                    <div className="form-group">
                        <input className="form-control mt-2" type="text" placeholder="Nome Completo" value={name} onChange={(e)=>setName(e.target.value)} required/>
                        <input className="form-control mt-2" type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required/>
                        <input className="form-control mt-2" type="email" placeholder="E-mail" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                        <input className="form-control mt-2" type="password" placeholder="Senha" value={password}  onChange={(e)=>setPassword(e.target.value)} required/>
                        <input className="form-control mt-2" type="number" placeholder="Número USP" value={NUSP} onChange={(e)=>setNUSP(parseInt(e.target.value))} required/>
                        

                        <label htmlFor="ingrusp" className="mt-2">Ingresso USP:</label>
                        <select id="ingrusp" className="form-control" value={anoIngressoUSP} onChange={(e)=>setAnoIngressoUSP(e.target.value)} required>
                            <option disabled value=""> -- Selecione um ano -- </option>
                            {generateLast20Years()}
                        </select>

                        <label htmlFor="ingranesh" className="mt-2">Ingresso Ganesh:</label>
                        <select id="ingranesh" className="form-control" value={anoIngressoGanesh} onChange={(e)=>setAnoIngressoGanesh(e.target.value)} required>
                            <option disabled value=""> -- Selecione um ano -- </option>
                            {generateLast20Years()}
                        </select>

                        <input className="btn btn-primary w-100 mt-4 " type="submit" value="Registrar-se    "/>
                    </div>
                </form>
            </div>
        </div>
    );
}