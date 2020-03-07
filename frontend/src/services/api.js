import Axios from 'axios';

const API_ADDR = 'http://192.168.0.86:3333';
let axios;
setToken(null);


export function setToken(token) {
    axios = Axios.create({
        baseURL: API_ADDR,
        headers: {
            'x-access-token': JSON.stringify(token)
        }
    });
}

export async function sendRegister(data) {
    return await axios.post('/register', data);
}

export async function sendLogin(data) {
    return await axios.post('/authenticate', data);
}

export async function sendLogout() {
    return await axios.post('/products');
}