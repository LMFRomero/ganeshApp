import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3333",
    withCredentials: true,
    timeout: 5000,
})

export default api