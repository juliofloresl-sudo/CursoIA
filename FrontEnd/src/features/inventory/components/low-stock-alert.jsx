import { AlertTriangle } from 'lucide-react';

const alerts = [
  { id: 1, name: 'Martillo', stock: 2, minimum: 5 },
  { id: 2, name: 'Clavos', stock: 1, minimum: 5 },
];

export default function LowStockAlert() {
  return (
    <div className="card">
      <h2>Alertas de stock mínimo</h2>
      <ul className="alert-list">
        {alerts.map((alert) => (
          <li key={alert.id} className="alert-item">
            <AlertTriangle size={16} className="warning-icon" />
            <div>
              <strong>{alert.name}</strong>
              <p>Stock actual: {alert.stock} | Mínimo: {alert.minimum}</p>
            </div>
            <span className="badge">Stock bajo</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
