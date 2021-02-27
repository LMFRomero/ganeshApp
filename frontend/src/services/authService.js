import api from './_api'

export const authService = { 
    login,
    logout,
    register,
    recoverLink,
    resetPassword
}

function login() { }

function logout() { }

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
