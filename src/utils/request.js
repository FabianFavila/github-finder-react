import axios from 'axios';

const API = 'https://api.github.com';

const request = axios.create({
    baseURL: API,
    method: 'GET'
});

export default request;