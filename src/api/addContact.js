import axios from './axios';

const addContact = (userID) => axios.post('/contacts', { userID });

export default addContact;