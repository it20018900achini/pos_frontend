import axios from 'axios';

const api = axios.create({
  baseURL: 'http://pos-dsxh.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});




export default api;
