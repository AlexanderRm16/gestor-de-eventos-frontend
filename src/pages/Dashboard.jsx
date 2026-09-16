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

  const estadisticas = useMemo(() => {
    const total = eventos.length;
    const ahora = Date.now();
    const proximos = eventos.filter((e) => aTimestamp(e) >= ahora).length;
    return { total, proximos };
  }, [eventos]);

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
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Encabezado Principal */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Panel de Eventos</h1>
          <p className="mt-1 text-sm text-muted">Gestiona, busca y administra la agenda de tu plataforma.</p>
        </div>
        <Link
          to="/dashboard/crear"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-[#0b0f0e] shadow-sm transition-transform active:scale-95 hover:opacity-90"
        >
          + Nuevo evento
        </Link>
      </div>

      {/* Mini Panel de Estadísticas */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">Total de Eventos</p>
          <p className="mt-2 font-display text-3xl font-bold text-primary">{estadisticas.total}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">Próximos a realizarse</p>
          <p className="mt-2 font-display text-3xl font-bold text-ink">{estadisticas.proximos}</p>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, lugar o descripción…"
          className="min-w-[240px] flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink transition-colors focus:border-primary"
        />
        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink transition-colors focus:border-primary"
        >
          {OPCIONES_ORDEN.map((opcion) => (
            <option key={opcion.value} value={opcion.value} className="bg-surface text-ink">
              {opcion.label}
            </option>
          ))}
        </select>
      </div>

      {/* Contenido de la Lista */}
      <div className="mt-6">
        {cargando && <p className="text-sm text-muted animate-pulse">Cargando eventos…</p>}

        {!cargando && error && (
          <div className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger border border-danger/20">
            <p>{error}</p>
            <button type="button" onClick={recargar} className="mt-2 font-semibold underline">
              Reintentar conexión
            </button>
          </div>
        )}

        {!cargando && !error && eventosFiltrados.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
            <p className="text-sm text-muted">
              {eventos.length === 0
                ? 'Todavía no hay eventos registrados en la base de datos.'
                : 'Ningún evento coincide con los criterios de búsqueda.'}
            </p>
          </div>
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
