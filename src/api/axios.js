import axios from 'axios';

const BASE_URL = 'https://infobip-api.herokuapp.com';
const axiosIntance = axios.create({
    baseURL: BASE_URL,
});

axiosIntance.interceptors.request.use((config) => {
  config.headers.Token = localStorage.getItem("accessToken");
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosIntance;