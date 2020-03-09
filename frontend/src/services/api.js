import Axios from 'axios';
import { currentSession } from './session-manager';

const API_ADDR = 'http://143.107.3.11:3333';

let axios = Axios.create({
    baseURL:API_ADDR, 
});

export async function sendRegister(data) {
    return await axios.post('/register', data);
}

export async function sendLogin(data) {
    return await axios.post('/authenticate', data);
}

export async function sendLogout() {
    console.log('Sending logout request...');
    let response = await axios.post('/logout', {sessionID: currentSession.getSessionID()});
    currentSession.destroyCookie();
    return response;
}


export default axios;