import api from './_api'
import handleErrors from './_handlers'

export const requestService = { 
    getAll,
    acceptUser,
    rejectUser
}

function getAll() { 
    return api.get('/user/?needsApproval=1')
    .then((response) => Promise.resolve(response.data))
    .catch(handleErrors)
    // .catch(() => Promise.resolve('Return mockup Data'))
    // .then((response) => {
    //     return Promise.resolve([{
    //         _id: "123abc", username: 'Z3z1nh013', name: 'Zé Silva e Silva'  
    //          email: 'ze@zinho.com',  yearJoinGanesh: 2018, 
    //     }])
    // })
}

function acceptUser(userEmail) { 
    return api.post('user/requestUser/acceptUser/', { email: userEmail })
    .then((response) => Promise.resolve(response.data))
    .catch(handleErrors) 
}

function rejectUser(userEmail) { 
    return api.post('user/requestUser/rejectUser/', { email: userEmail })
    .then((response) => Promise.resolve(response.data))
    .catch(handleErrors) 
}