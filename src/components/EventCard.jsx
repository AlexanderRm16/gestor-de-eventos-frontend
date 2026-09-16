// components/EventCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatearFecha, formatearHora } from '../utils/dateUtils';

export default function EventCard({ evento, alEliminar }) {
  const [confirmando, setConfirmando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  async function manejarEliminar() {
    setEliminando(true);
    try {
      await alEliminar(evento.id);
    } finally {
      setEliminando(false);
      setConfirmando(false);
    }
  }

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-display text-lg font-semibold text-ink">{evento.nombre}</p>
        <p className="text-sm text-muted">
          {formatearFecha(evento.fecha)} · {formatearHora(evento.hora)}
          {evento.lugar ? ` · ${evento.lugar}` : ''}
        </p>
        {evento.descripcion && (
          <p className="mt-1 max-w-lg text-sm text-ink/80">{evento.descripcion}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          to={`/dashboard/editar/${evento.id}`}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-bg"
        >
          Editar
        </Link>

        {confirmando ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">¿Eliminar?</span>
            <button
              type="button"
              onClick={manejarEliminar}
              disabled={eliminando}
              className="rounded-full bg-danger px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {eliminando ? 'Eliminando…' : 'Sí'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmando(false)}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-ink"
            >
              No
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-danger hover:bg-danger-soft"
          >
            Eliminar
          </button>
        )}
      </div>
    </li>
  );
}