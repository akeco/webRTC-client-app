import axios from './axios';

const register = data => axios.post('/register', data);

export default register;