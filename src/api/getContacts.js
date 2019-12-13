import axios from './axios';

const getContacts = ({ id, name }) => {
    let additionalParams = id ? `/${id}` : '';

    if (!additionalParams && name) additionalParams = `?name=${name}`;
    return axios.get(`/contacts${additionalParams ? additionalParams : ''}`);
}

export default getContacts;