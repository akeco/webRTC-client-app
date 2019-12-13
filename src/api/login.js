import axios from './axios';

const login = (email, password) => axios.post('/login', { email, password });

export default login;