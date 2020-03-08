import api, { sendLogin } from "./api";


async function loginAndRetrieveSessionID(email, password) {
    if (!email || !password) {
        console.error('Missing login information!');
        return undefined;
    }
    const loginResponse = await sendLogin({email, password});
    console.log(loginResponse);
    return loginResponse.data.sessionID;
}

let globalSessionID = null;

export class Session {
    constructor(cookieManager, data) {   
        this.cookieManager = cookieManager;
        if (!data) 
            globalSessionID = null;
        else if (data.sessionID) 
            globalSessionID = data.sessionID;
        else if (data.email && data.password) 
            this.authenticate(data.email, data.password);
    }

    loadSessionFromCookie() {
        globalSessionID = this.cookieManager.cookies.ganesh;
    }

    saveSessionToCookie() {
        console.log('Setting cookie', globalSessionID);
        this.cookieManager.setCookie('ganesh', globalSessionID, {
            path: '/',
            maxAge: 1800,
            // httpOnly: true
        });
        console.log('after cookie:',globalSessionID)
    }

    destroyCookie() {
        this.cookieManager.removeCookie('ganesh');
    }

    async authenticate(email, password, callback) {
        let sessionID = await loginAndRetrieveSessionID(email, password);
        globalSessionID = sessionID;

        console.log('Setting sessionID:',sessionID)
        this.saveSessionToCookie();
        
        if (callback) return callback(sessionID);
        else return sessionID;
    }

    hasSession() {
        console.log('inner hassession:', globalSessionID)
        return globalSessionID !== null && globalSessionID !== undefined;
    }

    getSessionID() {
        return globalSessionID;
    }

    async isValid() {
        console.log('checking if ', globalSessionID, 'is valid')
        let sessionID = globalSessionID;
        try {
            let response = await api.post('/validate', {sessionID});
            if (response.status===200) return true;
        } catch {
            return false;
        }
            
    }

    async isAuthenticated() {
        // if (!this.hasSession())
        //     this.loadSessionFromCookie(); //Try to get session from cookie if forgotten
        return this.hasSession() && await this.isValid();
    }
}

export let currentSession = new Session(null);
export function createSession(cookieManager, data) {
    currentSession = new Session(cookieManager, data);
}
