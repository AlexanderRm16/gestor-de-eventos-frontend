import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEventos } from '../context/EventContext.jsx';
import EventCard from '../components/EventCard.jsx';
import { aTimestamp } from '../utils/dateUtils';

const OPCIONES_ORDEN = [
  { value: 'fecha-asc', label: 'Fecha (próximos primero)' },
  { value: 'fecha-desc', label: 'Fecha (recientes primero)' },
  { value: 'nombre-asc', label: 'Nombre (A-Z)' },
];

export default function Dashboard() {
  const { eventos, cargando, error, recargar, borrarEvento } = useEventos();
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('fecha-asc');

  const eventosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    let lista = eventos;

    if (texto) {
      lista = lista.filter((evento) =>
        [evento.nombre, evento.lugar, evento.descripcion]
          .filter(Boolean)
          .some((campo) => campo.toLowerCase().includes(texto)),
      );
    }

    const ordenada = [...lista];
    if (orden === 'fecha-asc') {
      ordenada.sort((a, b) => aTimestamp(a) - aTimestamp(b));
    } else if (orden === 'fecha-desc') {
      ordenada.sort((a, b) => aTimestamp(b) - aTimestamp(a));
    } else if (orden === 'nombre-asc') {
      ordenada.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    }

    return ordenada;
  }, [eventos, busqueda, orden]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Eventos</h1>
          <p className="text-sm text-muted">Busca, ordena, edita o elimina tus eventos.</p>
        </div>
        <Link
          to="/dashboard/crear"
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          + Nuevo evento
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, lugar o descripción…"
          className="min-w-[220px] flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        >
          {OPCIONES_ORDEN.map((opcion) => (
            <option key={opcion.value} value={opcion.value}>
              {opcion.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        {cargando && <p className="text-sm text-muted">Cargando eventos…</p>}

        {!cargando && error && (
          <div className="rounded-lg bg-danger-soft px-4 py-3 text-sm text-danger">
            <p>{error}</p>
            <button type="button" onClick={recargar} className="mt-2 underline">
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && eventosFiltrados.length === 0 && (
          <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
            {eventos.length === 0
              ? 'Todavía no hay eventos registrados.'
              : 'Ningún evento coincide con la búsqueda.'}
          </p>
        )}

        {!cargando && !error && eventosFiltrados.length > 0 && (
          <ul className="space-y-3">
            {eventosFiltrados.map((evento) => (
              <EventCard key={evento.id} evento={evento} alEliminar={borrarEvento} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
