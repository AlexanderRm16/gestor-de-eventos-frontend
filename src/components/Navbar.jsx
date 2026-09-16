// components/Navbar.jsx
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const enlaces = [
  { to: '/dashboard', label: 'Gestionar eventos', end: true },
  { to: '/dashboard/crear', label: 'Crear evento' },
];

function claseEnlace({ isActive }) {
  return [
    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-primary text-white' : 'text-muted hover:bg-primary-soft hover:text-primary',
  ].join(' ');
}

export default function Navbar() {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="font-display text-xl font-semibold text-ink">Gestor de Eventos</span>
        </div>

        <nav className="flex items-center gap-2">
          {enlaces.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={claseEnlace}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted sm:inline">Hola, {usuario?.usuario}</span>
          <button
            type="button"
            onClick={cerrarSesion}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-danger hover:text-danger"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}