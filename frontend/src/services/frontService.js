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
    .then((response) => Promise.resolve(response.data))
    .catch(handleErrors)
    // .catch(() => Promise.resolve('Return mockup Data'))
    // .then(() => Promise.resolve({message: "Frente cadastrada com sucesso!" }) )
}

function update(frontId, front) {
    return api.put('/front/' + frontId, front)
    .then((response) => Promise.resolve(response.data))
    .catch(handleErrors) 
    // .catch(() => Promise.resolve('Return mockup Data'))
    // .then(() => Promise.resolve({message: "Frente atualizada com sucesso!" }) )
 }

function _delete(frontId) { 
    return api.delete('/front/' + frontId)
    .then((response) => Promise.resolve(response.data))
    .catch(handleErrors) 
}

function getById(frontId) { 
    return api.get('/front/' + frontId)
    .then((response) => Promise.resolve(response.data))
    .catch(handleErrors)
    // .catch(() => Promise.resolve('Return mockup Data'))
    // .then(() => {
    //     return Promise.resolve({
    //         _id:   '123FRONT45', name: 'Segurança Web', slug: 'seguranca-web',
    //         description: 'Estudo de vulnerabilidades mais comuns como OWASP TOP 10 e outras.',
    //         type: 'study', membersOnly: false, isDeleted: false
    //     })
    // })
}

function getAll() { 
    return api.get('/front/')
    .then((response) => Promise.resolve(response.data))
    .catch(handleErrors)
    // .catch(() => Promise.resolve('Return mockup Data'))
    // .then((response) => {
    //     return Promise.resolve([
    //         { 
    //             _id:   '123FRONT45', name: 'Segurança Web', slug: 'seguranca-web',
    //             description: 'Estudo de vulnerabilidades mais comuns como OWASP TOP 10 e outras.',
    //             type: 'study', membersOnly: false, isDeleted: false,
    //             members: [ {username:"teste"}, {username:"Gabriel"}, {username:"Kairi"}, {username:"Axel"}]
    //         }
    //     ])
    // })
}

function getOptions() { 
    return api.get('/front/options/')
    .then((response) => Promise.resolve(response.data.options))
    .catch(handleErrors)
    // .catch(() => Promise.resolve('Return mockup Data'))
    // .then((response) => {
    //     return Promise.resolve([
    //         { name: 'Segurança Web',      slug: 'seguranca-web'},
    //         { name: 'Redes & Pentest',    slug: 'redes'},
    //         { name: 'Criptografia',       slug: 'cripto'},
    //         { name: 'Engenharia Reversa', slug: 'reversa'},
    //     ])
    // })
}

function addMember(frontSlug, username) { 
    return api.post(`/front/addUser/${frontSlug}`, { username })
    .then((response) => Promise.resolve(response.data))
    .catch(handleErrors)
    // .catch(() => Promise.resolve('Return mockup Data'))
    // .then(()  => Promise.resolve({ message: "Membro adicionado!" }) )
}

function removeMember(frontSlug, username) { 
    return api.post(`/front/removeUser/${frontSlug}`, { username })
    .then((response) => Promise.resolve(response.data))
    .catch(handleErrors)
    // .catch(() => Promise.resolve('Return mockup Data'))
    // .then(()  => Promise.resolve({ message: "Membro adicionado!" }) )
}