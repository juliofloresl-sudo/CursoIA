import { useState } from 'react';

export default function CashOpeningModal({ isOpen, onConfirm }) {
  const [amount, setAmount] = useState('');

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Fondo de caja inicial</h2>
        <label htmlFor="opening">Monto de fondo de caja inicial ($MXN)</label>
        <input id="opening" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} />
        <button type="button" onClick={() => onConfirm(Number(amount))}>Guardar fondo</button>
      </div>
    </div>
  );
}
