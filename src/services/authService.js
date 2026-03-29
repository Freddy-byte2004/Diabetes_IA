import api from '../api/axios';

export async function login({ usuario, contrasena }) {
  const res = await api.post('/auth/login', { usuario, contrasena });
  return res.data;
}

export async function register({ usuario, contrasena, nombre }) {
  const res = await api.post('/auth/register', { usuario, contrasena, nombre });
  return res.data;
}

export async function requestNewCode(usuario) {
  const res = await api.post('/auth/new-code', { usuario });
  return res.data;
}

export async function verifyCode({ usuario, codigo }) {
  const res = await api.post('/auth/verify-code', { usuario, codigo }, { validateStatus: (s) => s < 500 });
  return res;
}

export async function changePassword({ usuario, nuevaContrasena }) {
  const res = await api.post('/auth/change-password', { usuario, nuevaContrasena }, { validateStatus: (s) => s < 500 });
  return res;
}
