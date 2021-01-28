import Axios from 'axios';
import { safePost, SafeResponse } from './safeRequests';

const API_ADDR = 'http://192.168.0.86:3333';

let axios = Axios.create({
    baseURL:API_ADDR,
});

// SESSION:

export async function sendRegister(data: { name: string, username: string, email: string, password: string, NUSP: Number, anoIngressoUSP: string, anoIngressoGanesh: string}): Promise<SafeResponse> {
    console.log('Sending register request')
    return await safePost(axios, '/register', data, undefined, 'Failed to send register');
}

export async function sendLogin(data: { email: string, password: string }): Promise<SafeResponse<{sessionID: string}>> {
    console.log('Sending login request');
    return await safePost(axios, '/authenticate', data, {withCredentials:true}, 'Failed ot send login') as SafeResponse<{sessionID: string}>;
}

export async function sendLogout(): Promise<SafeResponse>{
    console.log('Sending logout request...');
    return await safePost(axios, '/logout', undefined, {withCredentials:true}, "Failed to send logout");    
}

export async function sendForgotPassword(data: {email: string}): Promise<SafeResponse> {
    console.log('Sending forgot-password request');
    return await safePost(axios, '/forgot-password', data, undefined, 'Failed to send forgot-password');
}

export async function sendResetPassword(data: {resetID: string, password: string}): Promise<SafeResponse> {
    console.log('Sending reset-password request')
    return await safePost(axios, '/reset-password', data, undefined, 'Failed to send reset-password');
}

export async function sendValidate(): Promise<SafeResponse> {
    console.log('Sending session validation request')
    return await safePost(axios, '/validate', undefined, {withCredentials:true}, 'Failed to validate session');
}

export default axios;