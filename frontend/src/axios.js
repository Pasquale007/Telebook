import axios from 'axios';
import { BASE_ENDPOINT } from './sharedValues';

axios.defaults.withCredentials = true

export const axiosInstance = axios.create({
    baseURL: BASE_ENDPOINT
});
