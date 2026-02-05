import axios from 'axios';

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = rawUrl.replace(/\/+$/, ''); // Removes one or more trailing slashes

export const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export const baseURL = API_URL;
