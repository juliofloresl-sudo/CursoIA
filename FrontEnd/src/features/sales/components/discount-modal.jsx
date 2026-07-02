import { useState } from 'react';

export default function DiscountModal({ isOpen, onClose, onConfirm }) {
  const [pin, setPin] = useState('');
  const [discount, setDiscount] = useState(15);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Descuento autorizado</h2>
        <label htmlFor="discount">Porcentaje</label>
        <select id="discount" value={discount} onChange={(event) => setDiscount(Number(event.target.value))}>
          <option value={10}>10%</option>
          <option value={15}>15%</option>
          <option value={20}>20%</option>
        </select>
        <label htmlFor="pin">PIN del supervisor</label>
        <input id="pin" type="password" value={pin} onChange={(event) => setPin(event.target.value)} />
        <div className="modal-actions">
          <button type="button" className="secondary" onClick={onClose}>Cancelar</button>
          <button type="button" onClick={() => onConfirm(discount, pin)}>Aplicar</button>
        </div>
      </div>
    </div>
  );
}
