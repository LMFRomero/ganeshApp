import api from './_api'
import { authService } from './authService'

export const userService = { 
    getById,
    // getByUsername,
    getAll,
    update,
    updatePassword,
    deleteAccount,
}

function getById(userId) { 
    return api.get('/user/' + userId)
    // .catch(handleErrors)
    .catch(() => Promise.resolve('Return mockup Data'))
    .then(() => {
        return Promise.resolve({
            id: "123abc", name: 'Zézinho 013', course: 'BCC', otherCourse: '', institution: 'USP/ICMC', otherInstitution: '',
            collegeID: '1337013', yearJoinCollege: "2021", yearJoinGanesh:  "2021",
            email: 'ze@zinho.com', username: 'Z3z1nh013', title: 'Membro', role:  60,
        })
    })
}

function getAll() { 
    return api.get('/users/')
    // .catch(handleErrors) 
    .catch(() => Promise.resolve('Return mockup Data'))
    .then((response) => {
        return Promise.resolve([{
            id: "123abc", username: 'Z3z1nh013', email: 'ze@zinho.com',  title: 'Membro',
            yearJoinGanesh:  "2021", status: true 
        }])
    })
}

function update(userId, user) { 
    return api.put('/user/' + userId, user)
    .then((response) => Promise.resolve(response.data))
    .catch(handleErrors) 
}

function updatePassword(userId, password, newPassword) { 
    return api.put('/user/' + userId + '/changePassword', { password, newPassword })
    .then((response) => Promise.resolve(response.data))
    .catch(handleErrors) 
}

function deleteAccount(userId, email) { 
    return api.delete('/user/' + userId)
    .then( () => {
        authService.logout()
        .then(() => { document.location.reload() })
    })
    .catch(handleErrors) 
}

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