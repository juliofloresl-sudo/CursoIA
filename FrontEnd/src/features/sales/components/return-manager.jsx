import { useState } from 'react';

export default function ReturnManager() {
  const [folio, setFolio] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(2);
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleProcess = () => {
    setPreviewVisible(true);
  };

  return (
    <div className="card">
      <h2>Devoluciones</h2>
      <input value={folio} onChange={(event) => setFolio(event.target.value)} placeholder="Folio de venta" />
      <label htmlFor="return-quantity">Unidades a devolver</label>
      <input id="return-quantity" type="number" min="1" value={selectedQuantity} onChange={(event) => setSelectedQuantity(Number(event.target.value))} />
      <button type="button" onClick={handleProcess}>Procesar devolución</button>
      {previewVisible ? (
        <div className="alert success">
          <strong>Nota de crédito aprobada</strong>
          <p>Folio: CR-1001</p>
          <p>Estatus: aprobado</p>
        </div>
      ) : null}
    </div>
  );
}
