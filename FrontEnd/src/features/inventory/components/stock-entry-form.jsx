import { useState } from 'react';

export default function StockEntryForm() {
  const [quantity, setQuantity] = useState('');
  const [invoice, setInvoice] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!invoice || !quantity) {
      setMessage('Completa los campos');
      return;
    }

    setMessage('Movimiento de inventario registrado con éxito');
    setQuantity('');
    setInvoice('');
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Entrada de mercancía</h2>
      <input value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="Cantidad recibida" />
      <input value={invoice} onChange={(event) => setInvoice(event.target.value)} placeholder="Factura del proveedor" />
      <button type="submit">Registrar movimiento</button>
      {message ? <div className="alert success">{message}</div> : null}
    </form>
  );
}
