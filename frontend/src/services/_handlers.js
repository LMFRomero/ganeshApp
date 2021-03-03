import { authService } from './authService'

function handleErrors(error) { 
    // Status Code is 401 -> Unauthorized
    if(error.response.status === 401){
        authService.logout()
        .then(() => { document.location.reload() })
    }

    // Status Code out of range 2xx
    if(error.response) {
        console.log(error.response)
        try {
            return Promise.reject(error.response.data)
        } catch(e) { 
            return Promise.reject({ message:'Ocorreu um no processamento da requisição!' })
        }
    }

    // No response received OR error in request settings
    return Promise.reject({ message:'Ocorreu um erro no envio!' })
}

export default handleErrors