// pages/Login.jsx
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { estaAutenticado, iniciarSesion } = useAuth();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  if (estaAutenticado) {
    const destino = ubicacion.state?.desde || '/dashboard';
    return <Navigate to={destino} replace />;
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    // Pequeña espera simulada para mostrar el estado de carga del botón.
    await new Promise((resolve) => setTimeout(resolve, 300));

    const resultado = iniciarSesion({ usuario, clave });
    setEnviando(false);

    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }

    navegar('/dashboard', { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-ink">Gestor de Eventos</h1>
        <p className="mt-1 text-sm text-muted">Inicia sesión para continuar.</p>

        <form onSubmit={manejarEnvio} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="usuario" className="mb-1 block text-sm font-medium text-ink">
              Usuario
            </label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="admin"
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="clave" className="mb-1 block text-sm font-medium text-ink">
              Contraseña
            </label>
            <input
              id="clave"
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className="mt-5 text-xs text-muted">
          Demo del curso — usuario <code>admin</code> / contraseña <code>admin123</code>.
        </p>
      </div>
    </div>
  );
}
