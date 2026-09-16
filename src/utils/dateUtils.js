export function formatearFecha(fechaISO) {
  if (!fechaISO) return '';
  const fecha = new Date(`${fechaISO}T00:00:00`);
  if (Number.isNaN(fecha.getTime())) return fechaISO;

  return fecha.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatearHora(hora) {
  if (!hora) return '';
  const [h, m] = hora.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return hora;

  const fecha = new Date();
  fecha.setHours(h, m, 0, 0);

  return fecha.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
}

// Combina fecha + hora en un timestamp comparable, para ordenar eventos.
export function aTimestamp(evento) {
  const fecha = evento?.fecha || '1970-01-01';
  const hora = evento?.hora || '00:00';
  const valor = new Date(`${fecha}T${hora}:00`).getTime();
  return Number.isNaN(valor) ? 0 : valor;
}