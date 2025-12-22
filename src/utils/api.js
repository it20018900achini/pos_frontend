import axios from 'axios';
import { settings } from '../constant';

const api = axios.create({
  baseURL: settings?.url,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
