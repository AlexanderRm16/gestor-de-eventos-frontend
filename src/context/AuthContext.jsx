import { createContext, useContext, useEffect, useState } from 'react';

const CREDENCIALES_VALIDAS = {
  usuario: 'admin',
  clave: 'admin123',
};

const CLAVE_STORAGE = 'gestor-eventos:sesion';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  // Al montar, recupera la sesión guardada (persistencia tras recargar).
  useEffect(() => {
    const sesionGuardada = localStorage.getItem(CLAVE_STORAGE);
    if (sesionGuardada) {
      setUsuario(JSON.parse(sesionGuardada));
    }
    setCargandoSesion(false);
  }, []);

  function iniciarSesion({ usuario: usuarioIngresado, clave }) {
    const esValido =
      usuarioIngresado === CREDENCIALES_VALIDAS.usuario &&
      clave === CREDENCIALES_VALIDAS.clave;

    if (!esValido) {
      return { ok: false, mensaje: 'Usuario o contraseña incorrectos.' };
    }

    const sesion = { usuario: usuarioIngresado };
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(sesion));
    setUsuario(sesion);
    return { ok: true };
  }

  function cerrarSesion() {
    localStorage.removeItem(CLAVE_STORAGE);
    setUsuario(null);
  }

  const value = {
    usuario,
    estaAutenticado: Boolean(usuario),
    cargandoSesion,
    iniciarSesion,
    cerrarSesion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return contexto;
}