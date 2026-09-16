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
    <li className="group flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary/50 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        {/* Título limpio y directo */}
        <h3 className="text-base font-semibold text-ink">
          {evento.nombre}
        </h3>
        
        {/* Metadatos con estilo técnico/monoespaciado */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted">
          <span className="text-primary">
            [{formatearFecha(evento.fecha)} @ {formatearHora(evento.hora)}]
          </span>
          {evento.lugar && (
            <span>
              dir: {evento.lugar}
            </span>
          )}
        </div>

        {evento.descripcion && (
          <p className="text-xs text-muted/90 pt-0.5 line-clamp-1">
            {evento.descripcion}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 pt-2 sm:pt-0 border-t border-border/40 sm:border-t-0">
        <Link
          to={`/dashboard/editar/${evento.id}`}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:bg-bg hover:border-ink/30 transition-colors"
        >
          Editar
        </Link>

        {confirmando ? (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-danger">¿Borrar?</span>
            <button
              type="button"
              onClick={manejarEliminar}
              disabled={eliminando}
              className="rounded-md bg-danger px-2.5 py-1.5 text-xs font-medium text-white disabled:opacity-50"
            >
              {eliminando ? '...' : 'Sí'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmando(false)}
              className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-bg"
            >
              No
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            className="rounded-md border border-transparent px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger-soft transition-colors"
          >
            Eliminar
          </button>
        )}
      </div>
    </li>
  );
}