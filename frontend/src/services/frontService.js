import api from './_api'
import handleErrors from './_handlers'

export const frontService = { 
    register,
    update,
    _delete,
    getById,
    getAll,
    getOptions,
    addMember,
    removeMember,
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
    return api.get('/fronts/')
    // .then((response) => Promise.resolve(response.data))
    // .catch(handleErrors)
    .catch(() => Promise.resolve('Return mockup Data'))
    .then((response) => {
        return Promise.resolve([
            { 
                id:   '123FRONT45', name: 'Segurança Web', slug: 'seguranca-web',
                description: 'Estudo de vulnerabilidades mais comuns como OWASP TOP 10 e outras.',
                type: 'study', membersOnly: false, deleted: false,
                members: [ {username:"teste"}, {username:"Gabriel"}, {username:"Kairi"}, {username:"Axel"}]
            },
            { 
                id:   '133FRONT45', name: 'Sh1v4', slug: 'sh1v4-ctfs',
                description: 'Frente para prática de CTFs do Ganesh',
                type: 'special', membersOnly: true, deleted: false,
                members: [ {username:"Xemnas"}, {username:"Naminé"}, {username:"2B"}]
            }
        ])
    })
}

function getOptions() { 
    return api.get('/fronts/options/')
    // .then((response) => Promise.resolve(response.data))
    // .catch(handleErrors)
    .catch(() => Promise.resolve('Return mockup Data'))
    .then((response) => {
        return Promise.resolve([
            { name: 'Segurança Web',      slug: 'seguranca-web'},
            { name: 'Redes & Pentest',    slug: 'redes'},
            { name: 'Criptografia',       slug: 'cripto'},
            { name: 'Engenharia Reversa', slug: 'reversa'},
        ])
    })
}

function addMember(frontSlug, username) { 
    return api.post(`/front/addUser/${frontSlug}`, { username })
    // .then((response) => Promise.resolve(response.data))
    // .catch(handleErrors)
    .catch(() => Promise.resolve('Return mockup Data'))
    .then(()  => Promise.resolve({ message: "Membro adicionado!" }) )
}

function removeMember(frontSlug, username) { 
    return api.post(`/front/removeUser/${frontSlug}`, { username })
    // .then((response) => Promise.resolve(response.data))
    // .catch(handleErrors)
    .catch(() => Promise.resolve('Return mockup Data'))
    .then(()  => Promise.resolve({ message: "Membro adicionado!" }) )
}