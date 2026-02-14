import axios from 'axios';

const api = axios.create({
    //check if this is the correct url
    //later on add headers to specify the type of data - JSON
    baseURL: 'http://localhost:8080',
});

export default api;