import axios from 'axios';

const API = axios.create({
  baseURL: 'https://excel-analytics-backend-1-02jp.onrender.com/api', // <-- updated backend URL
});

// Add JWT token to every request if logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;

