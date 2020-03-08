import api, { sendLogin } from "./api";

async function loginAndRetrieveToken(email, password) {
    if (!email || !password) return undefined;
    const loginResponse = await sendLogin({email, password});
    console.log(loginResponse);
    //TODO: warn html
}

async function isTokenValid(token) {
    let res = await api.get('/validate', {
        headers: {
            'x-access-token': token
        }
    });
    console.log('validate::', res);
    // TODO: implement jwt validation
    return res.status === 200;
}

export class Session {
    constructor(email, password, token) {   
        if (token) 
            this.token = token;
        else if (email && password) 
            this.authenticate(email, password);
        else 
            this.token = null;
    }

    async authenticate(email, password, callback) {
        this.token = await loginAndRetrieveToken(email, password);
        
        if (callback) return callback(this.token);
        else return this.token;
    }

    async isAuthenticated() {
        return this.token !== null && isTokenValid(this.token);
    }
}

export let currentSession = new Session();
