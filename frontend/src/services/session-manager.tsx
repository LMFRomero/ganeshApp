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
    cookies: { ganesh: string},
    setCookie: (name: string, value: any, options?: CookieSetOptions | undefined) => void,
    removeCookie: (name: string, options?: CookieSetOptions | undefined) => void
}



export class Session {
    cookieManager:CookieManager | null;
    sessionID: string | null;

    constructor(cookieManager: CookieManager | null, data?: any) {   
        this.cookieManager = cookieManager;
        this.sessionID = null;

        if (!data) return;

        if (data.sessionID) 
            this.sessionID = data.sessionID;
        else if (data.email && data.password) 
            this.authenticate(data.email, data.password);
    }

    loadSessionFromCookie() {
        if (this.cookieManager)
            this.sessionID = this.cookieManager.cookies.ganesh;
    }

    saveSessionToCookie() {
        if (!this.cookieManager) {
            console.error("ERROR: CookieManager is null")
            return;
        }

        this.cookieManager.setCookie('ganesh', this.sessionID, {
            path: '/',
            maxAge: 1800,
            // httpOnly: true
        });
    }

    destroyCookie() {
        if (this.cookieManager)
            this.cookieManager.removeCookie('ganesh');
    }

    async authenticate(email: string, password: string) {
        if (!email || !password) throw new Error("Missing login information");
        const response = await sendLogin({email, password});
        if (response.type === 'Success') {
            this.sessionID = response.response?.data.sessionID || null;
            this.saveSessionToCookie();
            return true;
        }
        else if (response.type === 'Error') {
            this.sessionID = null;
            this.destroyCookie();
            return false;
        }
    }

    hasSession(): boolean {
        return this.sessionID !== null && this.sessionID !== undefined;
    }

    async isValid(): Promise<boolean> {
        console.log('Sending validation request to backend')
        let sessionID = this.sessionID;
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
