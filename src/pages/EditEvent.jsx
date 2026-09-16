// pages/EditEvent.jsx
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEventos } from '../context/EventContext.jsx';
import EventForm from '../components/EventForm.jsx';

export default function EditEvent() {
  const { id } = useParams();
  const { eventos, editarEvento } = useEventos();
  const navegar = useNavigate();

  const evento = eventos.find((e) => e.id === id);

  async function manejarEnvio(datos) {
    await editarEvento(id, datos);
  }

  if (!evento) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8">
        <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
          No se encontró ese evento.{' '}
          <Link to="/dashboard" className="text-primary underline">
            Volver a la lista
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-ink">Editar evento</h1>
      <p className="mt-1 text-sm text-muted">Actualiza los datos y guarda los cambios.</p>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <EventForm
          valoresIniciales={evento}
          etiquetaEnviar="Guardar cambios"
          alEnviar={manejarEnvio}
          alCancelar={() => navegar('/dashboard')}
        />
      </div>
    </div>
  );
}