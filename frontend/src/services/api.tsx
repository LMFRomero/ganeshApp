import Axios from 'axios';
import { currentSession } from './session-manager';

const API_ADDR = 'http://127.0.0.1:3333';

let axios = Axios.create({
    baseURL:API_ADDR, 
});

type registerData = {
    name: string,
    username: string,
    email: string,
    password: string,
    NUSP: Number,
    anoIngressoUSP: string,
    anoIngressoGanesh: string,    
}

export async function sendRegister(data: registerData) {
    return await axios.post('/register', data);
}

export async function sendLogin(data: any) {
    return await axios.post('/authenticate', data);
}

export async function sendLogout() {
    console.log('Sending logout request...');
    let response = await axios.post('/logout', {sessionID: currentSession.getSessionID()});
    currentSession.destroyCookie();
    return response;
}


export default axios;