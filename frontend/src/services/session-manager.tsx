import api, { sendLogin } from "./api";

//Copied from  react-cookie's types.d.ts 
interface CookieSetOptions {
    path?: string;
    expires?: Date;
    maxAge?: number;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: boolean | 'none' | 'lax' | 'strict';
    encode?: (value: string) => string;
}

export interface CookieManager {
    cookies: Array<any>[],
    (name: string, value: any, options?: CookieSetOptions | undefined): void

    // setCookie, removeCookie
}

async function loginAndRetrieveSessionID(email: string, password: string) {
    if (!email || !password) {
        console.error('Missing login information!');
        return undefined;
    }
    const loginResponse = await sendLogin({email, password});
    console.log(loginResponse);
    return loginResponse.data.sessionID;
}

let globalSessionID: string | null = null;

export class Session {

    cookieManager:any;

    constructor(cookieManager: any, data?: any) {   
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

    async authenticate(email: string, password: string, callback?: Function) {
        let sessionID = await loginAndRetrieveSessionID(email, password);
        globalSessionID = sessionID;

        console.log('Setting sessionID:',sessionID)
        this.saveSessionToCookie();
        
        if (callback) return callback(sessionID);
        else return sessionID;
    }

    hasSession(): boolean {
        console.log('inner hassession:', globalSessionID)
        return globalSessionID !== null && globalSessionID !== undefined;
    }

    getSessionID() {
        return globalSessionID;
    }

    async isValid(): Promise<boolean> {
        console.log('checking if ', globalSessionID, 'is valid')
        let sessionID = globalSessionID;
        try {
            const response = await api.post('/validate', {sessionID});
            if (response.status===200) return true;
            else return false;
        } catch {
            return false;
        }
    }

    async isAuthenticated(): Promise<boolean> {
        // if (!this.hasSession())
        //     this.loadSessionFromCookie(); //Try to get session from cookie if forgotten
        return this.hasSession() && await this.isValid();
    }
}

export let currentSession = new Session(null);
export function createSession(cookieManager: any, data?: any) {
    currentSession = new Session(cookieManager, data);
}
