import axios from 'axios';

 const API_BASE_URL = 'https://ev-stations-46td.onrender.com/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, 
});


api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[api.js] Attached Authorization header:', config.headers.Authorization);
    } else {
      console.warn('[api.js] No token found in storage');
    }
    return config;
  },
  error => {
    console.error('[api.js] Request error:', error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.warn('[api.js] Received 401 Unauthorized - removing token');
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
     
      window.location.href = '/login';
    } else {
      console.error('[api.js] API response error:', error);
    }
    return Promise.reject(error);
  }
);

export default api;
