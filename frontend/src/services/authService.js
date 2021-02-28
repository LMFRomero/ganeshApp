import api from './_api'

export const authService = { 
    login,
    logout,
    register,
    recoverLink,
    resetPassword,
    isAuthenticated,
}

function login(email, password) {
    return api.post('/login', {email, password})
    .then((response) => {       
        // @TODO: Read JSON response object with basic user info:
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
    return api.post('/logout')
    .catch(() => Promise.resolve("Logout realizado"))
    .finally(() => {
        localStorage.removeItem("user")
        document.cookie = "ganeshSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        return Promise.resolve();
    })
}

function register(user) { 
    return api.post('/register', user)
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
    return api.post('/forgotPassword', {email})
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
    return api.post('/resetPassword/' + token, { password })
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
        const validToken = (user && user.username && user.role && user.title)

        // If auth object not valid then exclude the Cookie also
        if (!validToken)
            document.cookie = "ganeshSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        return validToken
    } catch (e) {
        return false
    }
}