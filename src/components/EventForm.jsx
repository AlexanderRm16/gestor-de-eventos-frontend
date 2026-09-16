import { useState } from 'react';

const VALORES_INICIALES = {
  nombre: '',
  fecha: '',
  hora: '',
  lugar: '',
  descripcion: '',
};

function validar(valores) {
  const errores = {};

  if (!valores.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio.';
  } else if (valores.nombre.trim().length < 3) {
    errores.nombre = 'Debe tener al menos 3 caracteres.';
  }

  if (!valores.fecha) {
    errores.fecha = 'La fecha es obligatoria.';
  }

  if (!valores.hora) {
    errores.hora = 'La hora es obligatoria.';
  }

  return errores;
}

export default function EventForm({
  valoresIniciales = VALORES_INICIALES,
  etiquetaEnviar = 'Guardar evento',
  alEnviar,
  alCancelar,
}) {
  const [valores, setValores] = useState({ ...VALORES_INICIALES, ...valoresIniciales });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [errorApi, setErrorApi] = useState(null);
  const [exito, setExito] = useState(false);

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((actual) => ({ ...actual, [name]: value }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setExito(false);
    setErrorApi(null);

    const erroresValidacion = validar(valores);
    setErrores(erroresValidacion);
    if (Object.keys(erroresValidacion).length > 0) return;

    setEnviando(true);
    try {
      await alEnviar(valores);
      setExito(true);
    } catch (err) {
      setErrorApi(
        err?.response?.data?.mensaje ||
          'No se pudo guardar el evento. Verifica que la API esté disponible.',
      );
    } finally {
      setEnviando(false);
    }
  }

  const campoClase = (nombreCampo) =>
    [
      'w-full rounded-lg border bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors',
      errores[nombreCampo]
        ? 'border-danger focus:border-danger'
        : 'border-border focus:border-primary',
    ].join(' ');

  return (
    <form onSubmit={manejarEnvio} className="space-y-5" noValidate>
      <div>
        <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-ink">
          Nombre del evento
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={valores.nombre}
          onChange={manejarCambio}
          className={campoClase('nombre')}
          placeholder="Ej. Taller de React"
        />
        {errores.nombre && <p className="mt-1 text-sm text-danger">{errores.nombre}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fecha" className="mb-1 block text-sm font-medium text-ink">
            Fecha
          </label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            value={valores.fecha}
            onChange={manejarCambio}
            className={campoClase('fecha')}
          />
          {errores.fecha && <p className="mt-1 text-sm text-danger">{errores.fecha}</p>}
        </div>

        <div>
          <label htmlFor="hora" className="mb-1 block text-sm font-medium text-ink">
            Hora
          </label>
          <input
            id="hora"
            name="hora"
            type="time"
            value={valores.hora}
            onChange={manejarCambio}
            className={campoClase('hora')}
          />
          {errores.hora && <p className="mt-1 text-sm text-danger">{errores.hora}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="lugar" className="mb-1 block text-sm font-medium text-ink">
          Lugar <span className="font-normal text-muted">(opcional)</span>
        </label>
        <input
          id="lugar"
          name="lugar"
          type="text"
          value={valores.lugar}
          onChange={manejarCambio}
          className={campoClase('lugar')}
          placeholder="Ej. Aula virtual"
        />
      </div>

      <div>
        <label htmlFor="descripcion" className="mb-1 block text-sm font-medium text-ink">
          Descripción <span className="font-normal text-muted">(opcional)</span>
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={3}
          value={valores.descripcion}
          onChange={manejarCambio}
          className={campoClase('descripcion')}
          placeholder="Detalles del evento…"
        />
      </div>

      {errorApi && (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{errorApi}</p>
      )}
      {exito && (
        <p className="rounded-lg bg-primary-soft px-3 py-2 text-sm text-primary">
          Evento guardado correctamente.
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={enviando}
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {enviando ? 'Guardando…' : etiquetaEnviar}
        </button>
        {alCancelar && (
          <button
            type="button"
            onClick={alCancelar}
            className="rounded-full border border-border px-5 py-2 text-sm font-medium text-ink hover:bg-bg"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
