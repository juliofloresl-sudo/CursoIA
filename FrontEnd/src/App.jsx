import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/auth-context';
import Sidebar from './components/layout/sidebar';
import LoginPage from './features/auth/pages/login-page';
import ProductListPage from './features/products/pages/product-list-page';
import ProductForm from './features/products/components/product-form';
import PosTerminalPage from './features/sales/pages/pos-terminal-page';
import StockEntryForm from './features/inventory/components/stock-entry-form';
import LowStockAlert from './features/inventory/components/low-stock-alert';
import PhysicalCountPage from './features/inventory/pages/physical-count-page';
import CashClosingPage from './features/cash-control/pages/cash-closing-page';
import './App.css';

function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-content">{children}</main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/pos" replace /> : <LoginPage />} />
      <Route path="/" element={<Navigate to={user ? '/pos' : '/login'} replace />} />
      <Route path="/pos" element={<ProtectedLayout><PosTerminalPage /></ProtectedLayout>} />
      <Route path="/products" element={<ProtectedLayout><ProductListPage /></ProtectedLayout>} />
      <Route path="/products/form" element={<ProtectedLayout><ProductForm /></ProtectedLayout>} />
      <Route path="/inventory" element={<ProtectedLayout><><StockEntryForm /><LowStockAlert /><PhysicalCountPage /></></ProtectedLayout>} />
      <Route path="/cash-close" element={<ProtectedLayout><CashClosingPage /></ProtectedLayout>} />
      <Route path="/tickets" element={<ProtectedLayout><div className="page"><h1>Reimpresión de tickets</h1><p>Próximamente</p></div></ProtectedLayout>} />
      <Route path="/settings" element={<ProtectedLayout><div className="page"><h1>Configuración</h1><p>Próximamente</p></div></ProtectedLayout>} />
      <Route path="*" element={<Navigate to={user ? '/pos' : '/login'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
