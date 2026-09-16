import API from './api';

export async function obtenerEventos() {
  const { data } = await API.get('/eventos');
  return data;
}

export async function obtenerEvento(id) {
  const { data } = await API.get(`/eventos/${id}`);
  return data;
}

export async function crearEvento(evento) {
  const { data } = await API.post('/eventos', evento);
  return data;
}

export async function actualizarEvento(id, evento) {
  const { data } = await API.put(`/eventos/${id}`, evento);
  return data;
}

export async function eliminarEvento(id) {
  const { data } = await API.delete(`/eventos/${id}`);
  return data;
}
