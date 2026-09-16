import { useNavigate } from 'react-router-dom';
import { useEventos } from '../context/EventContext.jsx';
import EventForm from '../components/EventForm.jsx';

export default function CreateEvent() {
  const { agregarEvento } = useEventos();
  const navegar = useNavigate();

  async function manejarEnvio(datos) {
    await agregarEvento(datos);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-ink">Crear evento</h1>
      <p className="mt-1 text-sm text-muted">Completa el formulario para registrar un evento.</p>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <EventForm
          etiquetaEnviar="Crear evento"
          alEnviar={manejarEnvio}
          alCancelar={() => navegar('/dashboard')}
        />
      </div>
    </div>
  );
}