import api from "../api/axios";

export async function getByCorreo(correo) {
  if (!correo) return null;
  const res = await api.get(`/usuario/correo/${correo}`);
  return res.data;
}

export async function getById(id) {
  if (!id) return null;
  const res = await api.get(`/usuario/${id}`);
  if (!res) return null;
  if (Array.isArray(res.data)) return res.data[0] || null;
  return res.data;
}

export async function updateUsuario(id, payload) {
  if (!id) throw new Error("id requerido");
  const res = await api.put(`/usuario/${id}`, payload);
  return res.data;
}

export default {
  getByCorreo,
  getById,
  updateUsuario,
};
