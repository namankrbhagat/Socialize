import axios from 'axios';

const rawUrl = import.meta.env.VITE_API_URL || 'https://socialize-backend-cyyy.onrender.com';
const API_URL = rawUrl.replace(/\/+$/, ''); // Removes one or more trailing slashes

console.log('API Config:', { rawUrl, API_URL, fullBaseURL: `${API_URL}/api` });

export const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export const baseURL = API_URL;
