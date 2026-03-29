import api from '../api/axios';

export async function getAll() {
  const res = await api.get('/paciente');
  return Array.isArray(res.data) ? res.data : [];
}

export async function getById(id) {
  const res = await api.get(`/paciente/${id}`);
  return res.data;
}

export async function createPatient(payload) {
  const res = await api.post('/paciente', payload);
  return res.data;
}

export async function updatePatient(id, payload) {
  const res = await api.put(`/paciente/${id}`, payload);
  return res.data;
}

export async function deletePatient(id) {
  const res = await api.delete(`/paciente/${id}`);
  return res.data;
}
