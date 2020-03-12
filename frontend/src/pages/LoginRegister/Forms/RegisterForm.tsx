import React, {useState} from 'react';

import { sendRegister } from '../../../services/api';
import { Link, useHistory } from 'react-router-dom';

let ykey = 2020;
function generateLast20Years() {
    let currYear = new Date().getFullYear();
    let options = [];
    for(let i = currYear; i > currYear-20; i--)
        options.push(<option key={ykey++}>{i}</option>);
    return options;
}

export default function RegisterForm(props: object) {
    let [name, setName] = useState('');
    let [username, setUsername] = useState('');
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [NUSP_str, setNUSP_str] = useState('');
    let [anoIngressoUSP, setAnoIngressoUSP] = useState('');
    let [anoIngressoGanesh, setAnoIngressoGanesh] = useState('');

    let history = useHistory();

    async function submitRegister(event: React.FormEvent) {
        event.preventDefault();
        const NUSP = parseInt(NUSP_str);
        const res = await sendRegister({name, username, email, password, NUSP, anoIngressoUSP, anoIngressoGanesh});
        console.log(res);

        setName('');
        setUsername('')
        setEmail('');
        setPassword('');
        setNUSP_str('');
        setAnoIngressoUSP('');
        setAnoIngressoGanesh('');

        history.push('/')
    }

    return (
        <React.Fragment>
            <h4 className="text-center d-block mt-3">Formulário de Ingresso</h4>
            <form action="/" onSubmit={submitRegister}>
                <div className="form-group">
                    <input className="form-control mt-2" type="text" placeholder="Nome Completo" value={name} onChange={(e)=>setName(e.target.value)} required/>
                    <input className="form-control mt-2" type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required/>
                    <input className="form-control mt-2" type="email" placeholder="E-mail" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                    <input className="form-control mt-2" type="password" placeholder="Senha" value={password}  onChange={(e)=>setPassword(e.target.value)} required/>
                    <input className="form-control mt-2" type="number" placeholder="Número USP" value={NUSP_str} onChange={(e)=>setNUSP_str(e.target.value)} required/>
                    

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
            <ul className="d-sm-flex nav justify-content-between mt-2 mt-sm-4 ml-n3 mr-n3 w-xl-50">
                <li className="nav-item text-left col-12 p-0 m-0 pl-xl-2">
                    <Link className="nav-link active" to='/login'>Já sou membro</Link>
                </li>
            </ul>
        </React.Fragment>
    );
}