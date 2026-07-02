import { LayoutGrid, ShoppingCart, RotateCcw, Box, Settings, LogOut, BadgeDollarSign } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';

const navigationByRole = {
  cajero: [
    { label: 'Punto de Venta', path: '/pos', icon: ShoppingCart },
    { label: 'Reimpresión de Tickets', path: '/tickets', icon: RotateCcw },
  ],
  administrador: [
    { label: 'Punto de Venta', path: '/pos', icon: ShoppingCart },
    { label: 'Catálogo', path: '/products', icon: LayoutGrid },
    { label: 'Inventario', path: '/inventory', icon: Box },
    { label: 'Corte de Caja', path: '/cash-close', icon: BadgeDollarSign },
    { label: 'Configuración', path: '/settings', icon: Settings },
  ],
  supervisor: [
    { label: 'Punto de Venta', path: '/pos', icon: ShoppingCart },
    { label: 'Catálogo', path: '/products', icon: LayoutGrid },
    { label: 'Inventario', path: '/inventory', icon: Box },
    { label: 'Corte de Caja', path: '/cash-close', icon: BadgeDollarSign },
    { label: 'Configuración', path: '/settings', icon: Settings },
  ],
  encargado: [
    { label: 'Punto de Venta', path: '/pos', icon: ShoppingCart },
    { label: 'Inventario', path: '/inventory', icon: Box },
    { label: 'Corte de Caja', path: '/cash-close', icon: BadgeDollarSign },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const links = navigationByRole[user?.rol] || [];

  return (
    <aside className="sidebar">
      <div>
        <h2>ITH POS</h2>
        <p className="sidebar-user">{user?.nombre || 'Usuario'}</p>
        <p className="sidebar-user-role">{user?.rol || 'Sin rol'}</p>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button type="button" className="sidebar-logout" onClick={logout}>
        <LogOut size={18} />
        <span>Cerrar sesión</span>
      </button>
    </aside>
  );
}
