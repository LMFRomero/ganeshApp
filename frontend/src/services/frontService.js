import api from './_api'
import handleErrors from './_handlers'

export const frontService = { 
    register,
    update,
    _delete,
    getById,
    getAll
}

function register(front) { 
    return api.post('/front', front)
    // .then((response) => Promise.resolve(response.data))
    // .catch(handleErrors)
    .catch(() => Promise.resolve('Return mockup Data'))
    .then(() => Promise.resolve({message: "Frente cadastrada com sucesso!" }) )
}

function update(frontId, front) {
    return api.put('/front/' + frontId, front)
    // .then((response) => Promise.resolve(response.data))
    // .catch(handleErrors) 
    .catch(() => Promise.resolve('Return mockup Data'))
    .then(() => Promise.resolve({message: "Frente atualizada com sucesso!" }) )
 }

function _delete() { 
    // return api.delete('/user/' + userId)
    // .then( () => {
    //     authService.logout()
    //     .then(() => { document.location.reload() })
    // })
    // .catch(handleErrors) 
}

function getById(frontId) { 
    return api.get('/front/' + frontId)
    // .then((response) => Promise.resolve(response.data))
    // .catch(handleErrors)
    .catch(() => Promise.resolve('Return mockup Data'))
    .then(() => {
        return Promise.resolve({
            id:   '123FRONT45', name: 'Segurança Web', slug: 'seguranca-web',
            description: 'Estudo de vulnerabilidades mais comuns como OWASP TOP 10 e outras.',
            type: 'study', membersOnly: false, deleted: false
        })
    })
}

function getAll() { 
    // return api.get('/users/')
    // .then((response) => Promise.resolve(response.data))
    // .catch(handleErrors)
    // // .catch(() => Promise.resolve('Return mockup Data'))
    // // .then((response) => {
    // //     return Promise.resolve([{
    // //         id: "123abc", username: 'Z3z1nh013', email: 'ze@zinho.com',  title: 'Membro',
    // //         yearJoinGanesh:  "2021", status: true 
    // //     }])
    // // })
}