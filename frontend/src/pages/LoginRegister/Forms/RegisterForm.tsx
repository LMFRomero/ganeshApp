import React, { useState, useEffect } from 'react'


import { sendRegister } from '../../../services/api';
import { Link, useHistory } from 'react-router-dom';

import $ from 'jquery';
import Toast from 'src/components/Toast/Toast';
import AxiosErrorToast from 'src/components/Toast/AxiosErrorToast';
import { AxiosError } from 'axios';

let keyPostfix = 0;
function generateLastYears(yearsToGenerate: number) {
    const currYear = new Date().getFullYear();
    const milis = new Date().getUTCMilliseconds();
    const options = [];

    for(let i = currYear; i > currYear-yearsToGenerate; i--)
        options.push(<option key={milis+'-'+(keyPostfix++)+i}>{i}</option>);
    return options;
}

export default function RegisterForm(props: object) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [NUSP_str, setNUSP_str] = useState('');
    const [anoIngressoUSP, setAnoIngressoUSP] = useState('');
    const [anoIngressoGanesh, setAnoIngressoGanesh] = useState('');

    const [invalidEmails, setInvalidEmails] = (useState(['\0']) as [string[], React.Dispatch<React.SetStateAction<string[]>>]);


    const history = useHistory();
    const preValidationToast = React.createRef<Toast>();
    const postValidationAxiosToast = React.createRef<AxiosErrorToast>();


    async function submitRegister(event: React.FormEvent) {
        event.preventDefault();
        const NUSP = parseInt(NUSP_str);
        if (password1 !== password2) {
            preValidationToast.current?.showContent({body: "As senhas não coincidem"})
            return;
        }

        //TODO: define behavior with non-USP members

        const safeRes = await sendRegister({name, username, email, password: password1, NUSP, anoIngressoUSP, anoIngressoGanesh});

        if (safeRes.type === 'Success') {
            history.push('/')
        } 
        else {
            const error = safeRes.error as AxiosError;
            console.log(JSON.stringify(error))
            console.log(error.code)
            if (error.message === "Request failed with status code 409") {
                setInvalidEmails([
                    ...invalidEmails, email
                ])
                $('#email-field').addClass('is-invalid')
            }
            postValidationAxiosToast.current?.showAxiosError(error);
        }
    }

    function checkPasswords() {
        const pass1 = $('#password-field-1');
        const pass2 = $('#password-field-2');
        if (password1 === '' || password2 === '' || password2 === password1) {
            pass1.removeClass('is-invalid');
            pass2.removeClass('is-invalid');
            return;
        }

        pass1.addClass('is-invalid');
        pass2.addClass('is-invalid');
    }

    useEffect(()=>{
        const emailField = $("#email-field");
        console.log()
        if (invalidEmails.indexOf(emailField.val() as string) >= 0)
            emailField.addClass('is-invalid');
        else
            emailField.removeClass('is-invalid');

    }, [email, invalidEmails])
    useEffect(checkPasswords, [password1, password2]);

    return (
        <React.Fragment>
            <h4 className="text-center d-block mt-3">Formulário de Ingresso</h4>
            <form action="/" onSubmit={submitRegister}>
                <div className="form-group">
                    <input className="form-control mt-2" type="text" placeholder="Nome Completo" value={name} onChange={(e)=>setName(e.target.value)} required/>
                    <input className="form-control mt-2" type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required/>
                    <div>
                        <input id="email-field" className="form-control mt-2 is-invalid" type="email" placeholder="E-mail" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                        <div className="invalid-feedback">
                            Email já cadastrado
                        </div>
                    </div>

                    <div>
                        <input id="password-field-1" className="form-control mt-2" type="password" placeholder="Senha" value={password1}  onChange={(e)=>setPassword1(e.target.value)} required/>
                        <input id="password-field-2" className="form-control mt-2" type="password" placeholder="Confirme a senha" value={password2}  onChange={(e)=>setPassword2(e.target.value)} required/>
                        <div className="invalid-feedback">
                            Senhas não coincidem
                        </div>
                    </div>
                    

                    <input className="form-control mt-2" type="number" placeholder="Número USP" value={NUSP_str} onChange={(e)=>setNUSP_str(e.target.value)} required/>
                    <label htmlFor="ingrusp" className="mt-2">Ingresso USP:</label>
                    <select id="ingrusp" className="form-control" value={anoIngressoUSP} onChange={(e)=>setAnoIngressoUSP(e.target.value)} required>
                        <option disabled value=""> -- Selecione um ano -- </option>
                        {generateLastYears(20)}
                    </select>

                    <label htmlFor="ingranesh" className="mt-2">Ingresso Ganesh:</label>
                    <select id="ingranesh" className="form-control" value={anoIngressoGanesh} onChange={(e)=>setAnoIngressoGanesh(e.target.value)} required>
                        <option disabled value=""> -- Selecione um ano -- </option>
                        {generateLastYears(20)}
                    </select>

                    <input className="btn btn-primary w-100 mt-4 " type="submit" value="Registrar-se    "/>
                </div>
            </form>
            <ul className="d-sm-flex nav justify-content-between mt-2 mt-sm-4 ml-n3 mr-n3 w-xl-50">
                <li className="nav-item text-left col-12 p-0 m-0 pl-xl-2">
                    <Link className="nav-link active" to='/login'>Já sou membro</Link>
                </li>
            </ul>
            <Toast id="preValidationToast" ref={preValidationToast}
                title="Informações incorretas"
                delay={1500}/>
            <AxiosErrorToast 
                id="postValidationAxiosToast" 
                ref={postValidationAxiosToast}

            />
        </React.Fragment>
    );
}