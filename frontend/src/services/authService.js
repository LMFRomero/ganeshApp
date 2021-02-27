import api from './_api'

export const authService = { 
    login,
    logout,
    register,
    recoverLink,
    resetPassword
}

function login(email, password) {
    return api.post('/login', {email, password})
    .then((response) => {       
        // @TODO: Read JSON response object with basic user info:
        localStorage.setItem("auth", JSON.stringify({
            username: "vanloon",
            role: "member",            
        }))
    })
    .catch( (error) => {
        // Status Code out of range 2xx
        if(error.response) {
            return Promise.reject({ message:'Usuário ou Senha inválidos!' })
        }
        // No response received OR error in request settings
        return Promise.reject({ message:'Ocorreu um erro no envio!' })
    })
}

function logout() { 
    localStorage.removeItem("auth")
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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

function recoverLink() { }

function resetPassword() { }
