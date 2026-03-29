import api from '../api/axios';

export async function createAnalysis(payload) {
  const res = await api.post('/analisis', payload);
  return res.data;
}

export async function getByPaciente(id) {
  const res = await api.get(`/analisis/${id}`);
  return Array.isArray(res.data) ? res.data : [];
}

export async function getProbability(id) {
  const res = await api.get(`/analisisProbabilidad/${id}`);
  return res.data;
}
