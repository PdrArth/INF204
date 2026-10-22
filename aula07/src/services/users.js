import axios from 'axios';
import api from './api.js';

export async function getUsers({ signal } = {}) {
  if (!api.defaults.baseURL) {
    throw new Error('API_URL_MISSING');
  }

  const { data } = await api.get('/users', { signal });
  // Impede que uma resposta inesperada derrube a renderizacao dos cartoes.
  if (!Array.isArray(data) || data.some(user =>
    !Number.isInteger(user?.id) || typeof user.name !== 'string' || typeof user.email !== 'string'
  )) {
    throw new Error('INVALID_USERS_RESPONSE');
  }
  return data;
}

export function getErrorMessage(error) {
  if (error.message === 'API_URL_MISSING') {
    return 'Configure EXPO_PUBLIC_API_URL no arquivo .env e reinicie o Expo.';
  }
  if (error.message === 'INVALID_USERS_RESPONSE') {
    return 'O servidor retornou dados inesperados. Tente novamente em instantes.';
  }
  if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
    return 'A conexão demorou demais. Confira sua internet e tente novamente.';
  }
  if (axios.isAxiosError(error) && error.response) {
    return 'O serviço está indisponível no momento. Tente novamente em instantes.';
  }
  return 'Não foi possível conectar. Confira sua internet e tente novamente.';
}
