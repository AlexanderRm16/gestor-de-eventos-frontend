import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as eventService from '../services/eventService';

const EventContext = createContext(null);

function mensajeDeError(error) {
  if (error?.response?.data?.mensaje) return error.response.data.mensaje;
  if (error?.request) return 'No se pudo contactar la API. Verifica que el backend esté activo.';
  return 'Ocurrió un error inesperado.';
}

export function EventProvider({ children }) {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargarEventos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await eventService.obtenerEventos();
      setEventos(datos);
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarEventos();
  }, [cargarEventos]);

  async function agregarEvento(datosEvento) {
    const nuevo = await eventService.crearEvento(datosEvento);
    setEventos((actual) => [...actual, nuevo]);
    return nuevo;
  }

  async function editarEvento(id, datosEvento) {
    const actualizado = await eventService.actualizarEvento(id, datosEvento);
    setEventos((actual) => actual.map((e) => (e.id === id ? actualizado : e)));
    return actualizado;
  }

  async function borrarEvento(id) {
    await eventService.eliminarEvento(id);
    setEventos((actual) => actual.filter((e) => e.id !== id));
  }

  const value = {
    eventos,
    cargando,
    error,
    recargar: cargarEventos,
    agregarEvento,
    editarEvento,
    borrarEvento,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEventos() {
  const contexto = useContext(EventContext);
  if (!contexto) {
    throw new Error('useEventos debe usarse dentro de <EventProvider>');
  }
  return contexto;
}