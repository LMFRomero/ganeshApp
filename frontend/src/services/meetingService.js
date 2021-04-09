import api from './_api'
import handleErrors from './_handlers'

export const meetingService = { 
    register,
    update,
    _delete,
    getById,
    getAll,
    addMember,
    removeMember,
}

function register(meeting) { 
    return api.post('/meeting/', meeting)
    .then((response) => Promise.resolve(response.data))
    .catch(handleErrors)
    // .catch(() => Promise.resolve('Return mockup Data'))
    // .then(() => Promise.resolve({message: "Reunião cadastrada com sucesso!" }) )
}

function update(meetingId, meeting) {
    return api.put(`/meeting/${meetingId}`, meeting)
    .then((response) => Promise.resolve(response.data))
    .catch(handleErrors) 
    // .catch(() => Promise.resolve('Return mockup Data'))
    // .then(() => Promise.resolve({message: "Reunião atualizada com sucesso!" }) )
 }

 function _delete(meetingId) { 
    return api.delete('/meeting/' + meetingId)
    .then((response) => Promise.resolve(response.data))
    .catch(handleErrors) 
}

function getById(meetingId) { 
    return api.get('/meeting/' + meetingId)
    .then((response) => Promise.resolve(response.data))
    .catch(handleErrors)
    // .catch(() => Promise.resolve('Return mockup Data'))
    // .then(() => {
    //     return Promise.resolve({
    //         _id:'M337', title: 'Reunião de Web - SQL Injection + HackTheBox', 
    //         date: '2021-03-22T14:30:00.000Z', duration: '2 horas', place: 'Online (Canal #web Discord)',
    //         content: 'Lorem Ipsum Dolor Sit Amet Veras Tamen',
    //         front:  { name: 'Segurança Web', slug: 'seguranca-web' },
    //         membersOnly: true, deleted: false,

    //         members: [ {username:"teste"}, {username:"Gabriel"}, {username:"Kairi"}, {username:"Axel"}],

    //         author: { username: "Gabriel Van Loon", title: "Membro" },
    //         publishDate: '2021-03-14T18:02:00.694Z'
    //     })
    // })
}

function getAll( page = 1, frontSlug = '') { 
    return api.get(`/meeting?page=${page}&slug=${frontSlug}`)
    .then((response) => Promise.resolve(response.data))
    .catch(handleErrors)
    // .catch(() => Promise.resolve('Return mockup Data'))
    // .then((response) => {
    //     return Promise.resolve({
    //         currentPage: page,
    //         maxPage: 19,
    //         results: [{
    //             _id:'M337', title: 'Reunião de Web - SQL Injection + HackTheBox', 
    //             date: '2021-03-14T18:02:00.694Z', duration: '2 horas', place: 'Online (Canal #web Discord)',
    //             front:  { name: 'Segurança Web', slug: 'seguranca-web' },
    //             author: { username: "Gabriel Van Loon", title: "Membro" },
    //             publishDate: '2021-03-14T18:02:00.694Z',
    //             members: [{username:"teste"}],
    //         },
    //     })
    // })
}

function addMember(meetingId, username) { 
    return api.post(`/meeting/addUser/${meetingId}`, { username })
    // .then((response) => Promise.resolve(response.data))
    // .catch(handleErrors)
    .catch(() => Promise.resolve('Return mockup Data'))
    .then(()  => Promise.resolve({ message: "Membro adicionado!" }) )
}

function removeMember(meetingId, username) { 
    return api.post(`/meeting/removeUser/${meetingId}`, { username })
    // .then((response) => Promise.resolve(response.data))
    // .catch(handleErrors)
    .catch(() => Promise.resolve('Return mockup Data'))
    .then(()  => Promise.resolve({ message: "Membro removido!" }) )
}