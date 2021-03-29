import api from './_api'

export const authService = { 
    login,
    logout,
    register,
    recoverLink,
    resetPassword,
    isAuthenticated,
    getAuth,
}

function login(email, password) {
    return api.post('/session/login', {email, password})
    .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data))
    })
    .catch((error) => {
        // Status Code out of range 2xx
        if(error.response) {
            return Promise.reject({ message:'Usuário ou Senha inválidos!' })
        }
        // No response received OR error in request settings
        return Promise.reject({ message:'Ocorreu um erro no envio!' })
    })
}

function logout() {
    return api.post('/session/logout')
    .catch(() => Promise.resolve("Logout realizado"))
    .finally(() => {
        localStorage.removeItem("user")
        return Promise.resolve();
    })
}

function register(user) { 
    return api.post('/user/register', user)
    .catch( (error) => {
        // Status Code out of range 2xx
        if(error.response) {
            return Promise.reject( 
                error.response.data || { message:'Ocorreu um no processamento da requisição!' }
            )
        }
        // No response received OR error in request settings
        return Promise.reject({ message:'Ocorreu um erro no envio!' })
    })
}

function recoverLink(email) { 
    return api.post('/user/forgotPassword', {email})
    .then((response) => { 
        return Promise.resolve({message: "Link enviado para seu e-mail!"})
    })
    .catch( (error) => {
        // Status Code out of range 2xx
        if(error.response) {
            return Promise.reject( 
                error.response.data || { message: 'Ocorreu um no processamento da requisição!' }
            )
        }
        // No response received OR error in request settings
        return Promise.reject({ message:'Ocorreu um erro no envio!' })
    })
}

function resetPassword(password, token) { 
    return api.post('/user/resetPassword/' + token, { password })
    .then((response) => { 
        return Promise.resolve({message: "Senha atualizada com sucesso!"})
    })
    .catch( (error) => {
        // Status Code out of range 2xx
        if(error.response) {
            return Promise.reject( 
                error.response.data || { message: 'Ocorreu um no processamento da requisição!' }
            )
        }
        // No response received OR error in request settings
        return Promise.reject({ message:'Ocorreu um erro no envio!' })
    })
}

function isAuthenticated() {
    try {
        const user = JSON.parse(localStorage.getItem("user"))
        const validToken = (user.id && user.username && user.title)
        return validToken
    } catch (e) {
        return false
    }
}

function getAuth() { 
    try { return JSON.parse(localStorage.getItem("user")) } 
    catch(e) { document.location.href = "/" }
}