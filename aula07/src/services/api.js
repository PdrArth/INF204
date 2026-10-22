import axios from 'axios';

// A tela nao conhece o servidor: endereco, prazo e headers ficam no Service.
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
